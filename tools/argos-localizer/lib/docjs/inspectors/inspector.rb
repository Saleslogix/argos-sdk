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

require 'rkelly'
require 'find'
require_relative '../meta/file'
require_relative '../meta/project'

module DocJS
  module Inspectors
    class Inspector
      attr_accessor :visitor_type

      def initialize(visitor_type)
        @visitor_type = visitor_type
      end

      def inspect_file(path)
        process_file(path, path)
      end

      def inspect_path(path, recursive = true, &block)
        project = Meta::Project.new(path)

        (path.respond_to?(:each) ? path : [path]).each do |item|
          iterate_path(item, recursive) do |file|
            next if block_given? && !block.call(file)

            project.files << process_file(file, item)
          end
        end

        project
      end

      protected
      def iterate_path(path, recursive = true)
        return if !File.exists?(path)
        Find.find(path) do |file|
          next if file == path

          if File.directory? file
            throw :prune if !recursive
          else
            yield file
          end
        end
      end

      def process_file(path, base_path)
        File.open(path) do |file|
          content = file.read

          # todo: remove and add logging functionality
          print "#{path}"

          parser = RKelly::Parser.new

          begin
            ast = parser.parse(content)
          rescue Exception
            ast = nil
          end

          if ast.nil?
            # todo: remove and add logging functionality
            print " (ERROR)\n"
            next
          end

          # todo: remove and add logging functionality
          print "\n"

          source_file = Meta::File.new(File.basename(path), path)

          visitor = @visitor_type.new()

          ast.accept(visitor)

          source_file.modules = visitor.modules

          # create names for anonymous modules
          absolute_base_path = File.absolute_path base_path
          absolute_module_path = File.absolute_path path
          anonymous_module_count = 0

          for module_info in source_file.modules
            next if !module_info.name.nil?

            if absolute_module_path.index(absolute_base_path) === 0
              module_info.name = File.basename(absolute_base_path) + "/" + absolute_module_path[(absolute_base_path.length + 1)..-4]
              module_info.name += (anonymous_module_count + 1).to_s if anonymous_module_count > 0
            end

            anonymous_module_count += 1
          end

          source_file.classes = visitor.classes
          source_file.functions = visitor.functions
          source_file
        end
      end
    end
  end
end