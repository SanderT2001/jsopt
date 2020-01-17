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
        if (this.name != null)
            output += (` \`${this.name}\``);
        return output;
    }
}
