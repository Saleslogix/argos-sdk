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
import TextAreaField from './TextAreaField';
import FieldManager from '../FieldManager';

/**
 * @class argos.Fields.NoteField
 * The NoteField is a special case where an overly long text string should be inserted and
 * you want to take the user to another view for that specific input.
 *
 * The special part is that the it passes the value between its editor via an object with a
 * "Note" property., meaning the Edit View layout should have a field bound to the `noteProperty`
 * defined in this field ("Notes" by default").
 *
 * ###Example:
 *     {
 *         name: 'FullDescription',
 *         property: 'FullDescription',
 *         label: this.fullDescriptionText,
 *         type: 'note',
 *         view: 'text_editor_edit'
 *     }
 *
 * @alternateClassName NoteField
 * @extends argos.Fields.TextAreaField
 * @requires argos.FieldManager
 */
const control = declare('argos.Fields.NoteField', [TextAreaField], {});

lang.setObject('Sage.Platform.Mobile.Fields.NoteField', control);
export default FieldManager.register('note', control);
