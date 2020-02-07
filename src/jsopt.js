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
