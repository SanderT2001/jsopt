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
