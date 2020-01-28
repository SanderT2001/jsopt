/**
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * JsOpt-Core | JavaScript Optionalities
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * Class containing Core Functionalities for JsOpt.
 * JsOpt is a minimalistic Library to make working with Vanilla JavaScript more plesant.
 *
 * JsOpt accepts the following items when creating a new JsOpt Instance:
 *   > selector (example: '#id-of-element' or '.class-of-elements')
 *   > object
 *   > array
 *   > string
 *
 * @requires ECMAScript (ES) 6.* or up
 *
 * @version 0.1
 * @author Sander Tuinstra <sandert2001@hotmail.com>
 */
class JsOptCore
{
    /**
     * @type {bool}
     * Telling whether or not this instance is running in Debug mode.
     * When true, JsOptCore will show some debug information while running.
     */
    debug = true;

    /**
     * @type {mixed}
     */
    elements = null;

    constructor(input = RequiredArgument('input'))
    {
        // Set or get the elements based on the fact if the input is a queryselector or it is a data already.
        this.elements = ((this.isQuerySelector(input) === true) ? document.querySelectorAll(input) : input);
        if ((this.isEmpty() === true) && (this.debug === true)) {
            console.warn('No elements found by the given QuerySelector.');
        }
        return this;
    }

    foreach(callback = RequiredArgument('callback'))
    {
        ValidateArguments([{type: 'function', value: callback}]);

        for (var i = 0; i < this.elements.length; i++) {
            callback(i, this.elements[i]);
        }
        return this;
    }

    isQuerySelector(input)
    {
        return(
            (typeof input === 'string') &&
            // Check if the given selector start with `.` (class element selector) or `#` (id element selector).
            (/^([#]|[.])/.test(input) === true)
        );
    }

    getQuerySelectors()
    {
        let queryselectors = [];
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            let prefix = null;
            let selector = null;
            if ((this.isEmpty(element.id) === true) && (this.isEmpty(element.className) === false)) {
                // class selector
                prefix = '.';
                selector = element.className;
            } else if ((this.isEmpty(element.id) === false) && (this.isEmpty(element.className) === true)) {
                // id selector
                prefix = '#';
                selector = element.id;
            }
            queryselectors.push(prefix + selector);
        }
        return queryselectors;
    }

    /**
     * @param {mixed}|JsOptCore::elements value Containing the value to perform the empty check for.
     *
     * @return {bool} true  When the value is empty.
     *                false When the value is not empty.
     */
    isEmpty(value = this.elements)
    {
        return (
            (value === '') ||
            // Undefined or Null
            (value == null) ||
            (value.length == 0)
        );
    }
}

/**
 * Set `$` short for the instantiation of JsOpt-Core.
 *
 * @param {mixed} input
 *
 * @return {JsOpt-Core}
 */
var $ = (() => {
    'use strict';

    return (input) => {
        return new JsOptCore(input);
    };
})();

/**
 * @param {string} name
 *
 * @throws {exceptions\arguments\missing_argument_exception}
 */
const RequiredArgument = (name) => {
    throw new MissingArgumentException(name);
};

/**
 * Validates the values given in @param args by the following properties:
 *   > Value type
 *   > Value format (by Regex)
 *
 * @param {array} args Array containing the arguments to validate. One argument is an object in the array in the following format:
 *                       > type  = The type of variable that the value must be, for example 'int'/'string'.
 *                       > value = The actual value to validate.
 *                       > regex = Optional. Used to check whether or not the format of the value is valid.
 *
 * @throws {Error} When an argument/arguments are invalid.
 */
const ValidateArguments = (args) => {
    let invalid_args = [];

    for (let i = 0; i < args.length; i++) {
        if (typeof args[i].value != args[i].type) {
            // @TODO (Sander) Invalidargument class
            let txt = `\n  > argument #${i} must be of type \`${args[i].type}\`, \`${typeof args[i].value}\` given.`;
            invalid_args.push(txt);
            continue;
        }

        if (
            (args[i].regex != null) &&
            (new RegExp(args[i].regex).test(args[i].value) === false)
        ) {
            let txt = `\n  > argument #${i} must be a \`${args[i].regexExplanation}\`, \`${args[i].value}\` given.`;
            invalid_args.push(txt);
            continue;
        }

        // Valid Argument...
    }

    // No Errors, all arguments valid.
    if (invalid_args.length == 0) {
        return true;
    }

    // Build Error Message
    let errorMsg = '';
    for (let j = 0; j < invalid_args.length; j++) {
        errorMsg += invalid_args[j];
    }
    throw new Error(errorMsg);
};
