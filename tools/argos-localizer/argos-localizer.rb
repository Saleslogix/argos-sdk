#!/usr/bin/ruby
# encoding: utf-8
#
# Copyright (c) 2010, Sage Software, Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

$:.unshift './lib' # force use of local rkelly

require 'erb'
require 'json'
require 'trollop'
require 'nokogiri'
require 'pathname'
require 'fileutils'
require_relative 'lib/docjs'

class Array
  def stack(value)
    self.push(value)
    yield self if block_given?
    self.pop
  end
end

module Argos
  class Localizer
    attr_accessor :base_path,
                  :config

    def initialize(path, config)
      @base_path = Pathname.new(path || ".")
      @config = config
    end

    def run(command)
      case command
        when "export" then export
        when "import" then import
      end
    end

    def load_source_projects
      is_interesting_file = lambda {|file|
        (file =~ /\.js$/i) && !(file =~ /[\\\/]nls[\\\/]/i)
      }

      projects = {}

      @config[:projects].each do |project|
        inspector = @config[:export][:legacy] ? DocJS::Inspectors::ExtJsInspector.new() : DocJS::Inspectors::DojoAmdInspector.new()
        projects[project[:alias]] = inspector.inspect_path(@base_path + project[:path], true, &is_interesting_file)
      end

      projects
    end

    def is_localizable_property(path, name, value)
      return true if name =~ /FormatText$/
      return true if name =~ /Text$/
      return true if name && name.casecmp("message") == 0
      false
    end

    def resolve_localization_type(path, name, value)
      return "format" if name =~ /FormatText(\.|$)/i
      "text"
    end

    def iterate_properties(path, name, value, included, &block)
      included = included || is_localizable_property(path, name, value)

      if value.is_a?(DocJS::Meta::Class) || value.is_a?(DocJS::Meta::Module)
        value.properties.each {|property|
          iterate_properties(path + [property], property.name, property.value, included, &block)
        }
      elsif value.is_a?(Hash) && name != "attributeMap"
        value.each {|k,v|
          iterate_properties(path + [k], k, v, included, &block)
        }
      elsif value.is_a?(Enumerable)
        value.each_with_index {|v,i|
          iterate_properties(path + [i.to_s], i.to_s, v, included, &block)
        }
      else
        yield(path, name, value) if block_given? && included
      end
    end

    def path_to_property_name(path)
      extract = lambda {|segment| segment.respond_to?(:name) ? segment.name : segment}

      path.slice(1..-1).reduce(extract.call(path[0])) do |aggregate, segment|
        "#{aggregate}[%s]" % extract.call(segment)
      end
    end

    def export()
      source_projects = load_source_projects
      source_classes = source_projects.values.flat_map {|project| project.classes}
      source_modules = source_projects.values.flat_map {|project| project.modules}
      properties_by_type = {}
      [source_classes, source_modules].flatten.each do |object|
        iterate_properties([object], nil, object, false) do |path, name, value|
          type = resolve_localization_type(path, name, value)
          container = properties_by_type[type.to_sym] || (properties_by_type[type.to_sym] = [])
          container << {
            :class => path[0].name,
            :name => path_to_property_name(path.slice(1..-1)),
            :type => type,
            :value => value.to_s
          }
        end
      end

      builder = Nokogiri::XML::Builder.new do |xml|
        xml.localization {
          xml.properties {
            properties_by_type.values.flatten.each do |object|
              xml.property {
                xml.class_ object[:class]
                xml.name_ object[:name]
                xml.type_ object[:type]
                xml.value_ object[:value]
              }
            end
          }
        }
      end

      document = builder.doc

      if @config[:export][:transform]
        xslt = Nokogiri::XSLT(File.read(@config[:export][:transform]))
        document = xslt.transform(document)
      end

      File.open(@base_path + @config[:export][:path], 'w:UTF-8') do |file|
        file.write(document.to_xml)
      end

      if @config[:export][:split]
        properties_by_type.keys.each do |key|
          builder = Nokogiri::XML::Builder.new do |xml|
            xml.localization {
              xml.properties {
                properties_by_type[key].each do |object|
                  xml.property {
                    xml.class_ object[:class]
                    xml.name_ object[:name]
                    xml.type_ object[:type]
                    xml.value_ object[:value]
                  }
                end
              }
            }
          end

          document = builder.doc

          if @config[:export][:transform]
            xslt = Nokogiri::XSLT(File.read(@config[:export][:transform]))
            document = xslt.transform(document)
          end

          path = @base_path + @config[:export][:path]
          ext = path.extname
          path = path.dirname + (path.basename(ext).to_s + "-#{key.to_s}" + ext)

          File.open(path, 'w:UTF-8') do |file|
            file.write(document.to_xml)
          end
        end
      end
    end

    def build_localization_object(properties)
      object = current = {}

      for property in properties
        path = property[:name].scan(/\w+/)
        for segment in path[0..-2]
          current = (current[segment] ||= {})
        end

        current[path.last] = property[:value]
      end

      object
    end

    def import()
      @config[:import][:map].each do |culture, map|
        if !map[:in].kind_of?(Array)
            map[:in] = [map[:in]]
        end
        
        document = Nokogiri::XML("<localization/>")

        map[:in].each {|fileName|
            imported = Nokogiri::XML(File.open(@base_path + fileName, 'r:utf-8') { |f| f.read })
            items = imported.css("localization > data")
            document.root.add_child(items).first
        }

        if @config[:import][:transform]
          xslt = Nokogiri::XSLT(File.open(@config[:import][:transform], 'r:utf-8') { |f| f.read })
          document = xslt.transform(document)
        end

        properties = document.css("localization > properties > property")
        classes = {}
        properties.each {|property|
          current = (classes[property.css("class").text] ||= {})
          path = property.css("name").text.scan(/[^\[\]]+/)
          path[0..-2].each {|segment| current = (current[segment] ||= {})}
          current[path.last] = property.css("value").text
        }

        if @config[:import][:split]
          template = ERB.new(File.open(@config[:import][:template], 'r:utf-8') { |f| f.read }, 0, "%<>")
          classes.each do |name, localized|
            result = template.result(binding)

            segments = name.split(".")
            directory_path = @base_path + map[:out] + (segments[0..-2].join("/"))
            file_path = directory_path + (segments[-1] + ".js")

            FileUtils.mkdir_p directory_path
            File.open(file_path, 'w:UTF-8') do |file|
              file.write(result)
            end
          end
        else
          localized = classes
          template = ERB.new(File.open(@config[:import][:template], 'r:utf-8') { |f| f.read }, 0, "%<>")
          result = template.result(binding)

          File.open(@base_path + map[:out], 'w:UTF-8') do |file|
            file.write(result)
          end
        end
      end
    end
  end
end

def process_command_line
  global = Trollop::options do
    banner <<-EOS
Argos Localizer assists in the localization of Argos SDK based applications
by analyzing the source code in order to export localizable strings in an
XML format as well as importing localized strings from an XML format and
building up localization modules from that data.

Usage:
        ruby argos-build-helper.rb (import|export) [options]

Options:
EOS

    stop_on ["export", "import"]
  end

  command = ARGV.shift
  options = Trollop::options do
    opt :config_path, "configuration file path", :type => :string, :short => "c", :required => true
    opt :base_path, "base path for all paths specified in the configuration file", :type => :string, :short => "p", :required => true
  end

  Trollop::die :config_path, "must exist" unless File.exist?(options[:config_path])
  Trollop::die :base_path, "must exist" unless File.exist?(options[:base_path])

  [command, options]
end

def main
  command, options = process_command_line
  config = JSON.parse(File.read(options[:config_path]), :symbolize_names => true)
  localizer = Argos::Localizer.new(options[:base_path], config)
  localizer.run(command)
end

main
