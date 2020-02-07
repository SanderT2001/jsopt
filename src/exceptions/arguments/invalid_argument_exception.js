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
