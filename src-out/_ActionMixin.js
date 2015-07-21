<<<<<<< HEAD
define('argos/_ActionMixin', ['exports', 'module', 'dojo/_base/array', 'dojo/_base/declare', 'dojo/_base/event', 'dojo/_base/lang', 'dojo/dom-attr', 'dojo/query', 'dojo/NodeList-traverse'], function (exports, module, _dojo_baseArray, _dojo_baseDeclare, _dojo_baseEvent, _dojo_baseLang, _dojoDomAttr, _dojoQuery, _dojoNodeListTraverse) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    /*
     * See copyright file.
     */

    var _array = _interopRequireDefault(_dojo_baseArray);

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _event = _interopRequireDefault(_dojo_baseEvent);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _domAttr = _interopRequireDefault(_dojoDomAttr);

    var _query = _interopRequireDefault(_dojoQuery);

    /**
     * @class argos._ActionMixin
     * _ActionMixin provides a click listener to the `domNode` of view it is mixed into.
     *
     * When a click event is caught by the handler it finds the closest element with `data-action`
     * and fires that function in the context of the view. When calling the function it passes a `params`
     * object with the following:
     *
     *     {
     *         $event: 'Original click event',
     *         $src: 'The HTML node that initiated the event'
     *     }
     *
     * and then it mixes it all the `data-` attributes from the node into the params object.
     *
     * @alternateClassName _ActionMixin
     */
    var __class = (0, _declare['default'])('argos._ActionMixin', null, {
=======
/// <reference path="../declarations/argos.d.ts" />
/*
 * See copyright file.
 */

/**
 * @class argos._ActionMixin
 * _ActionMixin provides a click listener to the `domNode` of view it is mixed into.
 *
 * When a click event is caught by the handler it finds the closest element with `data-action`
 * and fires that function in the context of the view. When calling the function it passes a `params`
 * object with the following:
 *
 *     {
 *         $event: 'Original click event',
 *         $src: 'The HTML node that initiated the event'
 *     }
 *
 * and then it mixes it all the `data-` attributes from the node into the params object.
 *
 * @alternateClassName _ActionMixin
 */
define('argos/_ActionMixin', [
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/event',
    'dojo/_base/lang',
    'dojo/dom-attr',
    'dojo/query',
    'dojo/NodeList-traverse'
], function(
    array,
    declare,
    event,
    lang,
    domAttr,
    query
) {
    var __class = declare('argos._ActionMixin', null, {
>>>>>>> develop
        /**
         * @property {String}
         * Comma separated (no spaces) list of events to listen to
         */
        actionsFrom: 'click',
        /**
         * Extends the dijit Widget `postCreate` to connect to all events defined in `actionsFrom`.
         */
<<<<<<< HEAD
        postCreate: function postCreate() {
            // todo: add delegation
            _array['default'].forEach(this.actionsFrom.split(','), function (event) {
=======
        postCreate: function() {
            // todo: add delegation
            array.forEach(this.actionsFrom.split(','), function(event) {
>>>>>>> develop
                this.connect(this.domNode, event, this._initiateActionFromEvent);
            }, this);
        },
        /**
         * Verifies that the given HTML element is within our view.
         * @param {HTMLElement} el
         * @return {Boolean}
         */
<<<<<<< HEAD
        _isValidElementForAction: function _isValidElementForAction(el) {
            var contained = this.domNode.contains ? this.domNode !== el && this.domNode.contains(el) : !!(this.domNode.compareDocumentPosition(el) & 16);

            return this.domNode === el || contained;
=======
        _isValidElementForAction: function(el) {
            var contained = this.domNode.contains
                ? this.domNode !== el && this.domNode.contains(el)
                : !!(this.domNode.compareDocumentPosition(el) & 16);

            return (this.domNode === el) || contained;
>>>>>>> develop
        },
        /**
         * Takes an event and fires the closest valid `data-action` with the attached `data-` attributes
         * @param {Event} evt
         */
<<<<<<< HEAD
        _initiateActionFromEvent: function _initiateActionFromEvent(evt) {
            var el = (0, _query['default'])(evt.target).closest('[data-action]')[0],
                parameters,
                action = el && _domAttr['default'].get(el, 'data-action');
=======
        _initiateActionFromEvent: function(evt) {
            var el = query(evt.target).closest('[data-action]')[0],
                parameters,
                action = el && domAttr.get(el, 'data-action');
>>>>>>> develop

            if (action && this._isValidElementForAction(el) && this.hasAction(action, evt, el)) {
                parameters = this._getParametersForAction(action, evt, el);

                this.invokeAction(action, parameters, evt, el);

<<<<<<< HEAD
                _event['default'].stop(evt);
=======
                event.stop(evt);
>>>>>>> develop
            }
        },
        /**
         * Extracts the `data-` attributes of an element and adds `$event` and `$source` being the two originals values.
         * @param {String} name Name of the action/function being fired.
         * @param {Event} evt The original event
         * @param {HTMLElement} el The node that has the `data-action` attribute
         * @return {Object} Object with the original event and source along with all the `data-` attributes in pascal case.
         */
<<<<<<< HEAD
        _getParametersForAction: function _getParametersForAction(name, evt, el) {
=======
        _getParametersForAction: function(name, evt, el) {
>>>>>>> develop
            var parameters, i, attrLen, attributeName, parameterName;

            parameters = {
                $event: evt,
                $source: el
            };

            for (i = 0, attrLen = el.attributes.length; i < attrLen; i++) {
                attributeName = el.attributes[i].name;
                if (/^((?=data-action)|(?!data))/.test(attributeName)) {
                    continue;
                }

                /* transform hyphenated names to pascal case, minus the data segment, to be in line with HTML5 dataset naming conventions */
                /* see: http://dev.w3.org/html5/spec/elements.html#embedding-custom-non-visible-data */
                /* todo: remove transformation and use dataset when browser support is there */
                parameterName = attributeName.substr('data-'.length).replace(/-(\w)(\w+)/g, function($0, $1, $2) {
                    return $1.toUpperCase() + $2;
                });

<<<<<<< HEAD
                parameters[parameterName] = _domAttr['default'].get(el, attributeName);
=======
                parameters[parameterName] = domAttr.get(el, attributeName);
>>>>>>> develop
            }

            return parameters;
        },
        /**
         * Determines if the view contains a function with the given name
         * @param {String} name Name of function being tested.
         * @param evt
         * @param el
         * @return {Boolean}
         */
<<<<<<< HEAD
        hasAction: function hasAction(name, evt, el) {
            return typeof this[name] === 'function';
=======
        hasAction: function(name, evt, el) {
            return (typeof this[name] === 'function');
>>>>>>> develop
        },
        /**
         * Calls the given function name in the context of the view passing
         * the {@link #_getParametersForAction parameters gathered} and the event and element.
         * @param {String} name Name of function being invoked.
         * @param {Object} parameters Collection of `data-` attributes from the element.
         * @param {Event} evt The event that fired
         * @param {HTMLElement} el The HTML element that has the `data-action`
         */
<<<<<<< HEAD
        invokeAction: function invokeAction(name, parameters, evt, el) {
=======
        invokeAction: function(name, parameters, evt, el) {
>>>>>>> develop
            return this[name].apply(this, [parameters, evt, el]);
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile._ActionMixin', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile._ActionMixin', __class);
    return __class;
>>>>>>> develop
});
