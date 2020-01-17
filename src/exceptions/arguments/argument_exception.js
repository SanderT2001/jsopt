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
