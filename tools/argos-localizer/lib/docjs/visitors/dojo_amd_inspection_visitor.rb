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
require_relative '../meta/module'
require_relative '../meta/class'
require_relative '../meta/function'
require_relative '../meta/property'

module DocJS
  module Visitors
    class DojoAmdInspectionVisitor < Visitor
      def visit_FunctionCallNode(node)
        if is_module_declaration?(node)
          @modules << create_module_from_node(node)
        end
        super
      end

      def is_module_declaration?(node)
        return false unless node.value.is_a? RKelly::Nodes::ResolveNode
        return false unless node.value.value == "define"
        return false unless node.arguments.is_a? RKelly::Nodes::ArgumentsNode
        return false unless node.arguments.value.length.between?(1,3)

        true
      end

      def find_ancestor(node, &block)
        current = node
        while ((current = current.parent))
          break if block.call(current)
        end
        current
      end

      def create_module_from_node(node)
        result = Meta::Module.new
        result.comment = get_comment_for_node(node.arguments)

        factory_node = nil

        case node.arguments.value.length
          when 3 then # named module
            factory_node = node.arguments.value[2]

            result.name = get_value_for_node(node.arguments.value[0])
            result.imports = get_value_for_node(node.arguments.value[1])
          when 2 then # anonymous module
            factory_node = node.arguments.value[1]

            # see if it's a special dojo release case
            name_node = find_ancestor(node) {|n| n.is_a?(RKelly::Nodes::PropertyNode)}
            cache_node = name_node && find_ancestor(name_node) {|n| n.is_a?(RKelly::Nodes::PropertyNode) && n.name == "cache"}
            require_node = cache_node && find_ancestor(cache_node) {|n| n.is_a?(RKelly::Nodes::FunctionCallNode) && n.value.value == "require"}

            result.name = remove_quotes(name_node.name) unless require_node.nil?
            result.imports = get_value_for_node(node.arguments.value[0])
          when 1 then # anonymous, no dependencies
            factory_node = node.arguments.value[0]
        end

        if factory_node.is_a? RKelly::Nodes::ObjectLiteralNode
          factory_node.value.each do |property|
            name = property.name
            type = get_type_for_node(property.value)
            value = get_value_for_node(property.value)
            comment = get_comment_for_node(property)
            case true
              when property.value.is_a?(RKelly::Nodes::FunctionExprNode) then
                result.methods << Meta::Function.new(name, comment)
              else
                result.properties << Meta::Property.new(name, comment, type, value)
            end
          end
        end

        result
      end

      def visit_ResolveNode(node)
        if is_class_declaration?(node)
          @classes << create_class_from_node(node)
        end
        if is_class_set?(node)
          @classes << create_class_from_node(node.parent.parent.value)
        end
      end

      def is_class_declaration?(node)
        return false unless node.value == 'declare'
        return false unless node.parent.is_a? RKelly::Nodes::FunctionCallNode
        return false unless node.parent.arguments.value.length == 3
        return false unless node.parent.arguments.value.first.is_a? RKelly::Nodes::StringNode
        true
      end

      def is_class_set?(node)
        return false unless node.value == "lang" && node.parent && node.parent.accessor == "setObject"
        true
      end

      def create_class_from_node(node)
        declare_call = node.parent

        result = Meta::Class.new
        result.comment = get_comment_for_node(node)

        case declare_call.arguments.value.length
          when 3 then
            name_node = declare_call.arguments.value[0]
            inherited_node = declare_call.arguments.value[1]
            properties_node = declare_call.arguments.value[2]
          when 2 then
            name_node = declare_call.arguments.value[0]
            if is_mixin?(declare_call.arguments.value)
              properties_node = declare_call.arguments.value[1].arguments.value[2]
            else
              properties_node = declare_call.arguments.value[1]
            end
          else
            raise 'Could not understand type declaration.'
        end

        result.name = remove_quotes(name_node.value)

        if inherited_node.is_a? RKelly::Nodes::DotAccessorNode
          result.extends << node_to_path(inherited_node)
        elsif inherited_node.is_a? RKelly::Nodes::ArrayNode
          inherited_node.value.each do |inherited|
            result.extends << node_to_path(inherited.value)
          end
        end

        if properties_node.value.is_a? Array
          properties_node.value.each do |property|
            name = property.name
            type = get_type_for_node(property.value)
            value = get_value_for_node(property.value)
            comment = get_comment_for_node(property)
            case true
              when property.value.is_a?(RKelly::Nodes::FunctionExprNode) then
                result.methods << Meta::Function.new(name, comment)
              else
                result.properties << Meta::Property.new(name, comment, type, value)
            end
          end
        end

        result
      end

      def is_mixin?(args)
        mixin = args[1]

        return false unless mixin.value.respond_to?("accessor") && mixin.value.accessor == 'mixin'

        true
      end
    end
  end
end
