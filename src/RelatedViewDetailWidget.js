/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


define('Sage/Platform/Mobile/RelatedViewDetailWidget', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/event',
    'dojo/on',
    'dojo/string',
    'dojo/dom-class',
    'dojo/when',
    'dojo/_base/Deferred',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/dom-attr',
    'dojo/_base/connect',
    'dojo/_base/array',
    'Sage/Platform/Mobile/Utility',
    'Sage/Platform/Mobile/Format',
    'dijit/_Widget',
    'Sage/Platform/Mobile/_Templated',
    'Sage/Platform/Mobile/ErrorManager',
    'Sage/Platform/Mobile/FieldManager',

    'Sage/Platform/Mobile/Fields/BooleanField',
    'Sage/Platform/Mobile/Fields/DateField',
    'Sage/Platform/Mobile/Fields/DecimalField',
    'Sage/Platform/Mobile/Fields/DurationField',
    'Sage/Platform/Mobile/Fields/HiddenField',
    'Sage/Platform/Mobile/Fields/LookupField',
    'Sage/Platform/Mobile/Fields/NoteField',
    'Sage/Platform/Mobile/Fields/PhoneField',
    'Sage/Platform/Mobile/Fields/SelectField',
    'Sage/Platform/Mobile/Fields/SignatureField',
    'Sage/Platform/Mobile/Fields/TextAreaField',
    'Sage/Platform/Mobile/Fields/TextField'
], function(
    declare,
    lang,
    event,
    on,
    string,
    domClass,
    when,
    Deferred,
    domConstruct,
    query,
    domAttr,
    connect,
    array,
    Utility,
    format,
    _Widget,
    _Templated,
    ErrorManager,
    FieldManager
) {
    return declare('Sage.Platform.Mobile.RelatedViewDetailWidget', [_Widget, _Templated], {
        owner: null,
        id: 'related-detail-view',
        icon: 'content/images/icons/ContactProfile_48x48.png',
        iconClass: 'fa fa-building-o fa-2x',
        rows: 3,
        lodingNode: null,
        /**
         * @property {Simplate}
         * Simple that defines the HTML Markup
         */
        widgetTemplate: new Simplate([
            '<div class="related-view-detail-widget {%: $$.cls %}">',
                    '<div class="content-panel" data-dojo-attach-point="contentNode"></div>',
            '</div>'
        ]),
        itemContentTemplate: new Simplate([
            '{%! $$.itemHeaderTemplate %}'
        ]),
        itemIconTemplate: new Simplate([
            '<div class="selector">',
            '{% if ($$.iconClass) { %}',
               '<div class="icon {%= $$.iconClass %}"></div>',
            '{% } %}',
            '</div>',
        ]),

        itemHeaderTemplate: new Simplate([
          '<div class="header {%: $$.headerClass %}">',
              '{%! $$.itemIconTemplate %}',
              '<h3>{%: $.HeaderValue %}</h3>',
          '</div>'
        ]),
        
        itemRowTemplate: new Simplate([
            '<div class="row {%: $$.rowClass %}" data-property="{%: $.$layout.property %}" data-rowindex="{%: $.$rowindex %}">',
                 '{%! $$.itemTemplate %}',
            '</div>'
        ]),
        itemTemplate: new Simplate([
           
            '<div id="label" class="labelCell">',
            '{% if ($.$layout.allowEdit) { %}',
            '{%! $$.itemEditLabelTemplate %}',
            '{% } else { %}',
            '{%! $$.itemLabelTemplate %}',
            '{% } %}',
            '</div>',
            '<div id="value" class="valueCell">',
            '<div class="value">',
            '<h4>{%! $$.itemValueTemplate %}<h4>',
            '</div>',
            '</div>',
            '{% if ($.$layout.allowEdit) { %}',
              '<div id="edit" class="editCell disableEdit">',
               '{%! $$.itemEditValueTemplate %}',
            '</div>',
            '{% } %}',
        ]),
        itemLabelTemplate: new Simplate([
            '<div class="label"><h4>{%: $.$layout.label %}<h4></div>'
        ]),
        itemEditLabelTemplate: new Simplate([
            '<div class="label"><div class="editLabel"><h4>{%: $.$layout.label %}<h4></div></div>'
        ]),
        itemValueTemplate: new Simplate([
           '{%: $.$value %}'
        ]),
        itemEditValueTemplate: new Simplate([
           '<div class="edit">{%: $.$value %}</div>'
        ]),
        loadingTemplate: new Simplate([
           '<div class="content-loading"><span>{%= $.loadingText %}</span></div>'
        ]),
        constructor: function(options) {
            lang.mixin(this, options);
            this._subscribes = [];
            this._subscribes.push(connect.subscribe('/app/refresh', this, this._onAppRefresh));
        },
        postCreate:function(){
                      
        },        
        onInit: function(options) {
            this._isInitLoad = true;
            this.onLoad();
        },
        onLoad: function () {

            if (!this.loadingNode) {
                this.loadingNode = domConstruct.toDom(this.loadingTemplate.apply(this));
                domConstruct.place(this.loadingNode, this.contentNode, 'last', this);
            }

            domClass.toggle(this.loadingNode, 'loading');

            if (this.owner.entry) {
                this.processEntry(this.owner.entry);

            }
            domClass.toggle(this.loadingNode, 'loading');
        },
        processEntry:function(entry){
                var docFrag, itemsFrag, contentNode, colNode, 
                    rowFrag, rowNode, rowCount,
                    lastrow, headerValue, 
                    itemsNode, layout, 
                    item,  
                    rowData, rowHTML, rowValueTpl;
                layout = this.layout;
                docFrag = document.createDocumentFragment();
            
                if (layout.length > 0) {
                    headerValue = this.getValue(layout[0], entry);
                }

                contentNode = domConstruct.toDom(this.itemContentTemplate.apply({ HeaderValue: headerValue }, this));
                docFrag.appendChild(contentNode);
                itemsFrag = document.createDocumentFragment();
                itemsNode = domConstruct.toDom('<div class="content-items"></div>');
                rowCount = 0;
                lastrow = false;
                rowValueTpl = this.itemValueTemplate;
                for (var i = 0; i < layout.length; i++) {
                    item = layout[i];
                    if (layout[0].name != item.name) {
                    
                        if (rowCount === 0) {
                            rowFrag = document.createDocumentFragment();
                            colNode = domConstruct.toDom('<div class="column"></div>');
                            lastrow = false;
                        }
                   
                        if (rowCount <= this.rows - 1)  {
                            rowData = {
                                $index: i,
                                $layout: item,
                                $value: this.getValue(item, entry)
                            };
                            if (item.renderer) {
                                this.itemValueTemplate = new Simplate([rowData.$value]);
                            } else if (item.tpl) {
                                rowData = rowData.$value;
                                if (!rowData) {
                                    rowData = {};
                                }
                                rowData.$layout = item;
                                rowData.$index = i;
                                this.itemValueTemplate = item.tpl;
                            } else {
                                this.itemValueTemplate = rowValueTpl;                           
                            }
                            rowNode = domConstruct.toDom(this.itemRowTemplate.apply(rowData, this));
                            if (item.allowEdit) {
                                on(rowNode, 'click', lang.hitch(this, this.onRowClick));
                            }
                            rowFrag.appendChild(rowNode);
                            if ((rowCount === this.rows-1)||(layout.length === i+1)) {
                                lastrow = true;
                            } else {
                                rowCount++;
                            }
                        } 
                    
                        if (lastrow) {
                            domConstruct.place(rowFrag, colNode, 'last');
                            itemsFrag.appendChild(colNode);
                            rowCount = 0;
                            lastrow = false;
                        }                     
                    }
                }            

            
                if (itemsFrag.childNodes.length > 0) {
                    domConstruct.place(itemsFrag, itemsNode, 'last');
                    docFrag.appendChild(itemsNode);
                }
            
                if (docFrag.childNodes.length > 0) {
                    domConstruct.place(docFrag, this.contentNode, 'last');
                }

            },
        getValue: function(layoutItem, entry){
            var value = '', rendered;
            value = Utility.getValue(entry, layoutItem.property, '');
            if (layoutItem['renderer'] && typeof layoutItem['renderer'] === 'function') {
                rendered = layoutItem['renderer'].call(this, value);
                value = layoutItem['encode'] === true
                    ? format.encode(rendered)
                    : rendered;
            }
            return value;
        },
        onRefreshView: function(evt) {
            this._onRefreshView();
            evt.stopPropagation();
        },
       _onRefreshView: function() {
           
            this.onLoad();
        },
        _onAppRefresh: function(data) {
            if (data && data.data) {
                if(data.resourceKind === this.resourceKind){
                    if (this.parentEntry && (this.parentEntry[this.parentProperty] === Utility.getValue(data.data, this.relatedProperty, ''))) {
                        this._onRefreshView();
                    } else {
                        if(this.editViewId === data.id){
                            this._onRefreshView();
                        }
                        if (this.editViewId === data.id) {
                            this._onRefreshView();
                        }
                    }
                }
            }
        },
        onRowClick: function (evt) {
            var parameters, property, rowindex, rowNode, lableNode, valueNode, editNode;
            property = evt.currentTarget.attributes['data-property'].value;
            rowindex = evt.currentTarget.attributes['data-rowindex'].value;
            rowNode = evt.currentTarget;

            rowNode.childNodes.forEach(function (node) {
                if (node.id === 'label') {
                    lableNode = node;
                }
                if (node.id === 'value') {
                    valueNode = node;
                }
                if (node.id === 'edit') {
                    editNode = node;
                }
            });
            event.stop(evt);
        },
        destroy: function() {
            array.forEach(this._subscribes, function(handle) {
                connect.unsubscribe(handle);
            });
           this.inherited(arguments);
        }
        
    });
});
