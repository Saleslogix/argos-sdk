import declare = require('dojo/_base/declare');
import lang = require( 'dojo/_base/lang');

/**
 * A decorator that converts a TypeScript class into a declare constructor.
 * This allows declare constructors to be defined as classes, which nicely
 * hides away the `declare([], {})` boilerplate.
 */
export default function dojoDeclare(...mixins: Object[]): ClassDecorator {
	return function (target: Function) {
		return declare(mixins, target.prototype);
	};
}
lang.setObject('Mobile.CultureInfo', dojoDeclare);
