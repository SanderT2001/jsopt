/**
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * JsOpt-Core | JavaScript Optionalities
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * Class containing Core Functionalities for JsOpt.
 * JsOpt is a minimalistic Library to make working with Vanilla JavaScript more plesant.
 *
 * JsOpt accepts the following items when creating a new JsOpt Instance:
 *   > Selector (example: '#id-of-element' or '.class-of-elements')
 *   > Event
 *   > Object
 *   > Array
 *   > String
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

    /**
     * @type {object}
     * Object containing all the RegEx'es that are used in JsOpt.
     */
    regexCollection = {
        queryselectorValidator: /^([#]|[.])/
    };

    /**
     * Gets a RegEx from @var JsOptCore::regexCollection by it name given in @param key.
     *
     * @param {string} key
     *
     * @return {RegEx}|null Returns a string which is the found RegEx.
     *                      Returns null when no RegEx could be found by the given @param key.
     */
    getRegex(key = RequiredArgument('key'))
    {
        return ((this.isEmpty(this.regexCollection[key]) === true) ? null : this.regexCollection[key]);
    }

    constructor(input = RequiredArgument('input'))
    {
        // Set or get the elements based on the fact if the input is a queryselector or it is a data already.
        if (this.isQuerySelector(input) === true) {
            this.elements = document.querySelectorAll(input);
        } else {
            this.elements = ((this.isEventVariable(input) === true) ? input.target.childNodes : input);
        }
        if ((this.isEmpty() === true) && (this.debug === true)) {
            console.warn('No elements found by the given QuerySelector.');
        }
        return this;
    }

    /**
     * Finds DOM-Elements in the current @var JsOptCore::elements by the QuerySelector in @param selector.
     *
     * This will also replace the @var JsOptCore::elements with the newly found elements.
     * When no elements are found, @var JsOptCore::elements is an empty array.
     *
     * @param {string} selector
     */
    find(selector = RequiredArgument('querySelector'))
    {
        ValidateArguments([{type: 'string', value: selector, regex: this.getRegex('queryselectorValidator'), regexExplanation: 'QuerySelector'}]);

        this.elements = document.querySelector(this.getQuerySelectors()[0])
                                .querySelectorAll(selector);
        if ((this.isEmpty() === true) && (this.debug === true)) {
            console.warn('No elements found by the given QuerySelector.');
        }
        return this;
    }

    /**
     * Loops through all the @var JsOptCore::elements and applies an Callback given in @param callback to every item.
     *
     * @param {function} callback
     */
    foreach(callback = RequiredArgument('callback'))
    {
        ValidateArguments([{type: 'function', value: callback}]);

        let isObject = (typeof this.elements === 'object');
        let iterations = (this.elements.length == null) ? Object.keys(this.elements).length : this.elements.length;
        for (var i = 0; i < iterations; i++) {
            let index = (isObject === true) ? Object.keys(this.elements)[i] : i;
            callback(index, this.elements[index]);
        }
        return this;
    }

    /**
     * Gets the Query Selector for every element in @var JsOptCore::elements and returns those.
     *
     * @return {array}
     */
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
     * Checks if the value from @param input is a Query Selector or not.
     *
     * @param {string} input
     *
     * @return {bool} Indicating whether or not the input variable is a Query Selector.
     */
    isQuerySelector(input = RequiredArgument('input'))
    {
        return(
            (typeof input === 'string') &&
            // Check if the given selector start with `.` (class element selector) or `#` (id element selector).
            (this.getRegex('queryselectorRegex').test(input) === true)
        );
    }

    /**
     * Checks if the variable from @param eventVar is of the type {Event}.
     *
     * @param {mixed} eventVar
     *
     * @return {bool} Indicating whether or not the variable is a Event Variable.
     */
    isEventVariable(eventVar = RequiredArgument('eventVar'))
    {
        return ((eventVar instanceof Event) && (this.isEmpty(eventVar.target.childNodes) === false));
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
