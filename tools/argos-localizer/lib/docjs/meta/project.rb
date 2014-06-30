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

module DocJS
  module Meta
    class Project
      attr_accessor :name,
                    :files

      def initialize(name = nil)
        @name = name
        @files = []
      end

      def classes
        if block_given?
          @files.each do |file|
            file.classes.each do |cls|
              yield cls, file
            end
          end
        else
          (@files.map do |file| file.classes end).flatten
        end
      end

      def modules
        if block_given?
          @files.each do |file|
            file.modules.each do |cls|
              yield cls, file
            end
          end
        else
          (@files.map do |file| file.modules end).flatten
        end
      end

      def functions
        if block_given?
          @files.each do |file|
            file.functions.each do |cls|
              yield cls, file
            end
          end
        else
          (@files.map do |file| file.functions end).flatten
        end
      end
    end
  end
end
