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

import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import json from 'dojo/_base/json';
import domAttr from 'dojo/dom-attr';
import format from '../Format';
import EditorField from './EditorField';
import FieldManager from '../FieldManager';
import getResource from '../I18n';

const resource = getResource('signatureField');

/**
 * @class argos.Fields.SignatureField
 * The SignatureField uses an HTML5 canvas element to render previews of the signature vector
 * provided by it's editor view {@link SignatureView SignatureView}.
 *
 * ###Example:
 *     {
 *         name: 'Signature',
 *         property: 'Signature',
 *         label: this.signatureText,
 *         type: 'signature'
 *     }
 *
 * @alternateClassName SignatureField
 * @extends argos.Fields.EditorField
 * @requires argos.FieldManager
 * @requires argos.Views.SignatureView
 * @requires argos.Format
 */
const control = declare('argos.Fields.SignatureField', [EditorField], {
  // Localization
  /**
   * @property {String}
   * Text used for ARIA label
   */
  signatureLabelText: resource.signatureLabelText,
  /**
   * @property {String}
   * Text used within button
   */
  signatureText: resource.signatureText,

  /**
   * @property {Number[][]}
   * A series of x,y coordinates in the format of: `[[0,0],[1,5]]`
   */
  signature: [],
  /**
   * @cfg {Object}
   * If overriding this value make sure to set all the values:
   *
   * key          default         description
   * ---------   ---------        ---------------------------------
   * scale       1                Ratio in which the vector to canvas should be drawn
   * lineWidth   1                Stroke thickness of the line
   * penColor    'blue'           Color of line. Accepts HTML safe string names or hex.
   * width       180              Width of signature preview in field
   * height      50               Height of signature preview in field
   */
  config: {
    scale: 1,
    lineWidth: 1,
    penColor: 'blue',
    width: 180,
    height: 50,
  },
  /**
   * @property {Simplate}
   * Simplate that defines the fields HTML Markup
   *
   * * `$` => Field instance
   * * `$$` => Owner View instance
   *
   */
  widgetTemplate: new Simplate([
    '<label for="{%= $.name %}">{%: $.label %}</label>',
    '<button class="button simpleSubHeaderButton" aria-label="{%: $.signatureLabelText %}"><span aria-hidden="true">{%: $.signatureText %}</span></button>',
    '<img data-dojo-attach-point="signatureNode" src="" width="{%: $.config.width %}" height="{%: $.config.height %}" alt="" />',
    '<input data-dojo-attach-point="inputNode" type="hidden">',
  ]),
  /**
   * Extends the {@link EditorField#createNavigationOptions parent} implementation by
   * also passing the `signature` array.
   * @return {Object} Navigation options
   */
  createNavigationOptions: function createNavigationOptions() {
    const options = this.inherited(arguments);
    options.signature = this.signature;
    return options;
  },
  /**
   * Complete override that gets the editor view, gets the values and calls set value on the field
   */
  getValuesFromView: function getValuesFromView() {
    const app = this.app;
    const view = app && app.getPrimaryActiveView && app.getPrimaryActiveView();
    if (view) {
      const value = view.getValues();
      this.currentValue = this.validationValue = value;
      this.setValue(this.currentValue, false);
    }
  },
  /**
   * Sets the signature value by using {@link format#imageFromVector format.imageFromVector}
   * to the img node and setting the array directly to `originalValue`.
   * @param val
   * @param initial
   */
  setValue: function setValue(val, initial) {
    if (initial) {
      this.originalValue = val;
    }

    this.currentValue = val;
    domAttr.set(this.inputNode, 'value', val || '');

    try {
      this.signature = json.fromJson(val);
    } catch (e) {
      this.signature = [];
    }

    if (!this.signature || Array !== this.signature.constructor) {
      this.signature = [];
    }

    this.signatureNode.src = format.imageFromVector(this.signature, this.config, false);
  },
  /**
   * Clears the value set to the hidden field
   */
  clearValue: function clearValue() {
    this.setValue('', true);
  },
  /**
   * Since the EditorField calls `formatValue` during {@link EditorField#complete complete}
   * we need to override to simply return the value given.
   * @param val
   * @return {Array/String}
   */
  formatValue: function formatValue(val) {
    return val;
  },
});

lang.setObject('Sage.Platform.Mobile.Fields.SignatureField', control);
export default FieldManager.register('signature', control);
