/**
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * JsOpt | JavaScript Optionalities
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * Extension on JsOpt-Core containing HTML specific functionalities.
 */
class JsOpt extends JsOptCore
{
    constructor(input = RequiredArgument('input'))
    {
        // Init core
        super(input);
    }

    // calls func with argument {event} e
    ready(callback = RequiredArgument('callback'))
    {
        document.addEventListener("DOMContentLoaded", (e) => {
            callback(e);
        });
    }

    /**
     * Changes the innerHTML of the @var JsOptCore::elements to the given value in @param newValue.
     * @TODO (Sander) Als input, dan valu veranderen, anders gewoon de html
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
//   > HTML Elements bewerken (attr)
//   > HTML Elements find
//   > append
//   > prepend
//   > off() (event listener)
//   > css edit
//   > .on(eventlistener)
