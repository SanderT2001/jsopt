/**
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * JsOpt | JavaScript Optionalities
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * Extension on JsOpt-Core containing HTML specific functionalities.
 */
class JsOpt extends JsOptCore
{
    eventlist = {};
    setEventList(name, callback)
    {
        this.eventlist[name] = callback;
        return true;
    }

    getEventList(name = null)
    {
        if (this.isEmpty(name) === true) {
            return this.eventlist;
        }

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
     * Vanilla JS:
     * document.getElementById("myBtn").addEventListener("click", displayDate);
     */
    on(eventName = RequiredArgument('eventName'), callback = RequiredArgument('callback'))
    {
        // @TODO (Sander) Check Type van arguments
        // @TODO (Sander) Docs
        // @TODO (Sander) Docs: Niet checken of event type wel bestaat, ivm dat user een custom event kan aanmaken!
        this.foreach((index, element) => {
            document.querySelector(this.getQuerySelectors()[index])
                    .addEventListener(eventName, callback);

            this.setEventList(eventName, callback);
        });
        return this;
    }

    /**
     * Vanilla JS:
     * document.getElementById("myDIV").removeEventListener("mousemove", myFunction);
     */
    off(eventName = null)
    {
        // @TODO (Sander) Check Type van arguments
        // @TODO (Sander) Docs
        // @TODO (Sander) Docs: Niet checken of event type wel bestaat, ivm dat user een custom event kan aanmaken!
        if (this.isEmpty(eventName) === true) {
            this.foreach((index, element) => {
                $(this.eventlist).foreach((eventname, eventcallback) => {
                    document.querySelector(this.getQuerySelectors()[index])
                            .removeEventListener(eventname, eventcallback);
                });
            });
        } else {
            let callback = this.getEventList(eventName);
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

    prepend(value)
    {
        // Just inside the element, before its first child.
        this.addToElements('afterbegin', value);
        return this;
    }

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
     * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
     */
    addToElements(position, value)
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

// TODO
//   > Volgorde van alles
//   > Compacte versie maken (releases 1 file voor alles)
//   > Virtual DOM bijhouden o.i.d. i.v.m. event listeners.
