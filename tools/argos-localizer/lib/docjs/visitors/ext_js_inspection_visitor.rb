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
require_relative 'visitor'
require_relative '../meta/module'
require_relative '../meta/class'
require_relative '../meta/function'
require_relative '../meta/property'

module DocJS
  module Visitors
    class ExtJsInspectionVisitor < Visitor
      def visit_DotAccessorNode(node)
        if is_module_declaration?(node)
          @modules << create_module_from_node(node)
        elsif is_class_declaration?(node)
          @classes << create_class_from_node(node)
        end
        super
      end

      def is_module_declaration?(node)
        return false unless node.accessor == 'namespace'
        return false unless node.value.is_a? RKelly::Nodes::ResolveNode
        return false unless node.value.value == 'Ext'
        return false unless node.parent.is_a? RKelly::Nodes::FunctionCallNode
        return false unless node.parent.arguments.is_a? RKelly::Nodes::ArgumentsNode
        return false unless node.parent.arguments.value.first.is_a? RKelly::Nodes::StringNode
        true
      end

      def create_module_from_node(node)
        result = Meta::Module.new
        result.name = node.parent.arguments.value.first.value[1..-2]
        result.comment = get_comment_for_node(node)

        result
      end

      def is_class_declaration?(node)
        return false unless node.accessor == 'extend'
        return false unless node.value.is_a? RKelly::Nodes::ResolveNode
        return false unless node.value.value == 'Ext'
        return false unless node.parent.is_a? RKelly::Nodes::FunctionCallNode
        return false unless node.parent.arguments.value.length.between?(2,3)
        true
      end

      def create_class_from_node(node)
        extend_call = node.parent

        result = Meta::Class.new
        result.comment = get_comment_for_node(node)

        case node.parent.arguments.value.length
          when 2 then
            raise 'Type name could not be determined.' unless extend_call.parent.is_a? RKelly::Nodes::OpEqualNode

            name_node = extend_call.parent.left
            extends_node = extend_call.arguments.value[0]
            properties_node = extend_call.arguments.value[1]
          when 3 then
            name_node = extend_call.arguments.value[0]
            extends_node = extend_call.arguments.value[1]
            properties_node = extend_call.arguments.value[2]
          else
            raise 'Could not understand type declaration.'
        end

        result.name = node_to_path(name_node).join('.')
        result.extends << node_to_path(extends_node).join('.')

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

        result
      end
    end
  end
end

