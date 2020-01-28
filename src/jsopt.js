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
     * Finds DOM-Elements in the current @var JsOptCore::elements by the QuerySelector in @param selector.
     *
     * This will also replace the @var JsOptCore::elements with the newly found elements.
     * When no elements are found, @var JsOptCore::elements is an empty array.
     *
     * @param {string} selector
     */
    find(selector = RequiredArgument('querySelector'))
    {
        ValidateArguments([{type: 'string', value: selector, regex: /^([#]|[.])/, regexExplanation: 'QuerySelector'}]);

        this.elements = document.querySelector(this.getQuerySelectors()[0])
                                .querySelectorAll(selector);
        if ((this.isEmpty() === true) && (this.debug === true)) {
            console.warn('No elements found by the given QuerySelector.');
        }
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

    on(eventName = RequiredArgument('eventName'), callback = RequiredArgument('callback'))
    {
        // @TODO (Sander) Check Type van arguments
        // @TODO (Sander) Docs
        // @TODO (Sander) Testen
        // @TODO (Sander) Docs: Niet checken of event type wel bestaat, ivm dat user een custom event kan aanmaken!
        // @TODO (Sander) Door alle elements heen loopen en toevoegen
        // @TODO (Sander) Lookup Table opbouwen van gezette events en hun callback functie, i.v.m. off()
        // Vanilla JS: document.getElementById("myBtn").addEventListener("click", displayDate);
    }

    off()
    {
        // @TODO (Sander) Check Type van arguments
        // @TODO (Sander) Docs
        // @TODO (Sander) Testen
        // @TODO (Sander) Docs: Niet checken of event type wel bestaat, ivm dat user een custom event kan aanmaken!
        // @TODO (Sander) Door alle elements heen loopen en verwijderen
        // @TODO (Sander) Gebruik maken van lookup table
        // @TODO (Sander) Als function niet meegegeven is dan alles verwijderen (Clone Node)
        //                var old_element = document.getElementById("btn");
        //                var new_element = old_element.cloneNode(true);
        //                old_element.parentNode.replaceChild(new_element, old_element);
        // Vanilla JS: document.getElementById("myDIV").removeEventListener("mousemove", myFunction);
    }

    prepend()
    {
        // als html:
        //   iets meer beforeend
        //   Element.insertAdjacentHTML()
        //   https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
        // als nodelist:
        //   node.prepend(textnode);
    }

    append()
    {
        // als html:
        //   iets meer beforeend
        //   Element.insertAdjacentHTML()
        //   https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
        // als nodelist:
        //   node.appendChild(textnode);
    }

    css()
    {
        //document.elm.style.border = "3px solid #FF0000";
    }

    attr()
    {
        //document.getElementsByTagName("H1")[0].setAttribute("class", "democlass");
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
//   > append
//   > prepend
//   > off() (event listener)
//   > css edit
//   > .on(eventlistener)
//   > Volgorde van alles
//   > Compacte versie maken (releases 1 file voor alles)
