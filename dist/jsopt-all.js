/**
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * JsOpt | JavaScript Optionalities
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
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

/**
 * An Base Exception
 *
 * @throws {Error}
 */
class Exception
{
    /**
     * @type {string}
     *
     * The default message to output when throwing an Exception.
     */
    defaultMessage = 'Error';

    /**
     * Actually throws the Exception. The message that will be thrown is gotten from @see Exception::getOutputMessage.
     *
     * @uses Exception::getOutputMessage to retrieve the Message to throw.
     *
     * @throws {Error}
     */
    throw()
    {
        throw new Error(this.getOutputMessage());
    }


    /**
     * Builds and returns the message that will be thrown.
     *
     * @return {string}
     */
    getOutputMessage()
    {
        return this.defaultMessage;
    }
}

/**
 * An Base Exception for an Argument Exception.
 *
 * @extends {Exception}
 */
class ArgumentException extends Exception
{
    /**
     * @type {string}
     *
     * The name of the Argument.
     */
    name = '';

    /**
     * @param {string} name
     * @TODO (Sander) Wat als @param name leeg is?
     */
    constructor(name)
    {
        super();

        this.name = name;
    }
}

/**
 * An Exception for when an given Argument for a Function is invalid.
 * Invalid means:
 *   > Wrong value type
 *   > Wrong value format
 *
 * @extends {ArgumentException}
 */
class InvalidArgumentException extends ArgumentException
{
    /**
     * @override
     */
    defaultMessage = 'Invalid Argument Value for';

    /**
     * @type {string}
     *
     * The message telling what the expected value was for the Argument.
     * This to give more context about what happend when this error is thrown.
     * When this value is empty, this additional information won't be added to the output of the throw.
     */
    expectedValue = '';

    constructor(name, expectedValue = '')
    {
        super(name);

        this.expectedValue = expectedValue;
        this.throw();
    }

    /**
     * @override
     */
    getOutputMessage()
    {
        let output = this.defaultMessage;
        if (this.name != null) {
            output += (` \`${this.name}\`.`);
        }
        if (this.expectedValue != '') {
            output += (` Expected \`${this.expectedValue}\`.`);
        }
        return output;
    }
}

/**
 * An Exception for when an Function/Method is missing an required Argument.
 *
 * @extends {ArgumentException}
 */
class MissingArgumentException extends ArgumentException
{
    /**
     * @override
     */
    defaultMessage = 'Missing Function Parameter';

    constructor(name)
    {
        super(name);

        this.throw();
    }

    /**
     * @override
     */
    getOutputMessage()
    {
        let output = this.defaultMessage;
        if (this.name != null) {
            output += (` \`${this.name}\``);
        }
        return output;
    }
}

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
    debug = false;

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
            (this.getRegex('queryselectorValidator').test(input) === true)
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

/**
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * JsOpt | JavaScript Optionalities
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * Extension on JsOpt-Core containing HTML specific functionalities.
 *
 * @version 0.1
 * @author Sander Tuinstra <sandert2001@hotmail.com>
 */
class JsOpt extends JsOptCore
{
    /**
     * @type {object}
     * Object containing all the set Events for the @var JsOptCore::elements.
     */
    eventlist = {};

    /**
     * Sets a new Event in the @var JsOpt::eventlist
     *
     * @param {string} name
     */
    setEventList(name = RequiredArgument('name'), callback = RequiredArgument('callback')) {
        ValidateArguments([
            {type: 'string', value: name},
            {type: 'function', value: callback}
        ]);

        this.eventlist[name] = callback;
        return true;
    }

    /**
     * Gets an Event from @var JsOpt::eventlist by its name given in @param name.
     *
     * @param {string} name
     *
     * @return {function} Containing the callback function for this Event.
     */
    getEvent(name = RequiredArgument('name'))
    {
        if (this.isEmpty(this.eventlist[name]) === true) {
            return {};
        }
        return this.eventlist[name];
    }

    constructor(input = RequiredArgument('input'))
    {
        // Init JsOptCore
        super(input);
    }

    /**
     * Fires the @param callback function when the DOM is Ready.
     *
     * @param {function} callback Containing the callback function.
     *                            The callback will be invoked with the following parameters given:
     *                              1. {event} e > The actual event that is created when the DOM is Ready.
     */
    ready(callback = RequiredArgument('callback'))
    {
        ValidateArguments([{type: 'function', value: callback}]);

        document.addEventListener("DOMContentLoaded", (e) => {
            callback(e);
        });
        return this;
    }

    /**
     * Changes the innerHTML of the @var JsOptCore::elements to the given value in @param newValue.
     *
     * @param {string}|'' newValue
     */
    changeInner(newValue = '')
    {
        this.foreach((index, element) => {
            element.innerHTML = newValue;
        });
        return this;
    }

    /**
     * Makes the hidden @var JsOptCore::elements visibile again.
     */
    show()
    {
        // Use empty string to revert the value back to its original.
        this.changeDisplayStyle('');
        return this;
    }

    /**
     * Hides the @var JsOptCore::elements.
     */
    hide()
    {
        this.changeDisplayStyle('none');
        return this;
    }

    /**
     * Removes the @var JsOptCore::elements from DOM.
     */
    remove()
    {
        this.foreach((index, element) => {
            element.parentNode.removeChild(element);
        });
        return this;
    }

    /**
     * Sets an Event on the @var JsOptCore::elements.
     *
     * Vanilla JS:
     * document.getElementById("myBtn").addEventListener("click", displayDate);
     *
     * @param {string}   eventName Containing the name for the event to set.
     *                               NOTE! Don't check if the Event exists, because you can create your own Javascript Events!
     * @param {function} callback  Containing the Callback Function that will be fired when the Event occurs.
     */
    on(eventName = RequiredArgument('eventName'), callback = RequiredArgument('callback')) {
        ValidateArguments([
            {type: 'string', value: eventName},
            {type: 'function', value: callback}
        ]);

        this.foreach((index, element) => {
            document.querySelector(this.getQuerySelectors()[index])
                    .addEventListener(eventName, callback);

            this.setEventList(eventName, callback);
        });
        return this;
    }

    /**
     * Removes an certain Event from the @var JsOptCore::elements or removes all the Events from these elements.
     *
     * Vanilla JS:
     * document.getElementById("myDIV").removeEventListener("mousemove", myFunction);
     *
     * @param {string} eventName|null When null, all the Events set in @var JsOpt::eventlist will be removed from the @var JsOptCore::elements.
     */
    off(eventName = null)
    {
        if (this.isEmpty(eventName) === true) {
            this.foreach((index, element) => {
                $(this.eventlist).foreach((eventname, eventcallback) => {
                    document.querySelector(this.getQuerySelectors()[index])
                            .removeEventListener(eventname, eventcallback);
                });
            });
        } else {
            let callback = this.getEvent(eventName);
            if (this.isEmpty(callback) === true) {
                if (this.debug === true) {
                    console.warn('No callback found. Check if the EventListener is set.');
                }
                return false;
            }

            this.foreach((index, element) => {
                document.querySelector(this.getQuerySelectors()[index])
                        .removeEventListener(eventName, callback);
            });
        }
        return this;
    }

    /**
     * Prepends HTML (Elements) to all the elements in @var JsOptCore::elements.
     *
     * @param {mixed} value
     */
    prepend(value = RequiredArgument('value'))
    {
        // Just inside the element, before its first child.
        this.addToElements('afterbegin', value);
        return this;
    }

    /**
     * Appends HTML (Elements) to all the elements in @var JsOptCore::elements.
     *
     * @param {mixed} value
     */
    append(value)
    {
        // Just inside the element, after its last child.
        this.addToElements('beforeend', value);
        return this;
    }

    /**
     * Adds or Edits a CSS Property to the @var JsOptCore::elements with the name given in @param property and with the value given in @param value.
     *
     * Vanilla JS:
     * document.elem.style.border = "3px solid #FF0000";
     *
     * @param {string} property CSS Compatible Property!
     * @param {string} value|''
     */
    css(property = RequiredArgument('property'), value = '')
    {
        this.foreach((index, element) => {
            element.style[property] = value;
        });
        return this;
    }

    /**
     * Edit an attribute with the name of @param name of the @var JsOptCore::elements to the given value in @param value
     *
     * Vanilla JS:
     * document.getElementsByTagName("H1")[0].setAttribute("class", "democlass");
     *
     * @param {string} name
     * @param {string} value|''
     */
    attr(name = RequiredArgument('name'), value = '')
    {
        this.foreach((index, element) => {
            element.setAttribute(name, value);
        });
        return this;
    }

    /**
     * Changes the CSS Display Property of the @var JsOptCore::elements to the given @param property.
     *
     * @param {string}|'' property CSS `display`-property compatible!
     *                               When the value is an empty string (''), the `display`-property will be reset to its original value.
     */
    changeDisplayStyle(property = '')
    {
        this.foreach((index, element) => {
            element.style.display = property;
        });
        return this;
    }

    /**
     * Adds Elements to the @var JsOptCore::elements with the position of the insertion given in @param position.
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
     *
     * @param {string} position
     * @param {mixed}  value
     */
    addToElements(position = RequiredArgument('string'), value)
    {
        if (typeof value === 'string') {
            this.foreach((index, element) => {
                element.insertAdjacentHTML(position, value);
            });
        } else if ((value instanceof JsOpt === true) || (value instanceof JsOptCore === true)) {
            let valueNodes = value.elements;

            // Add every node in @var valueNodes to every element in @var JsOptCore::elements.
            this.foreach((index, element) => {
                value.foreach((valueNodeIndex, valueNode) => {
                    element.insertAdjacentHTML(position, valueNode.outerHTML);
                });
            });
        }
        return this;
    };
}

/**
 * Set `$` short for the instantiation of JsOpt.
 *
 * @param {mixed} input
 *
 * @return {JsOpt}
 */
var $ = (() => {
    'use strict';

    return (input) => {
        return new JsOpt(input);
    };
})();
