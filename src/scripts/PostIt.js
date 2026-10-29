class PostIt
{
    // ------------------------------------------------------
    // ATTRIBUTES
    // ------------------------------------------------------

    #color = "";
    #text = "";

    #position = {
        x: 0,
        y: 0
    }

    // ------------------------------------------------------
    // CONSTRUCTORS
    // ------------------------------------------------------

    /**
     * Creates a new post-it according to the given data
     * @param {String} text Post-it's text
     * @param {Object} position Post-it's position in pixels
     * @param {String} color Post-it's color
     * @author Álvaro Fernández Barrero
     */
    constructor(text = "", position = {x: 0, y: 0}, color = "red")
    {
        this.text = text;
        this.position = position;
        this.color = color;
    }

    // ------------------------------------------------------
    // METHODS
    // ------------------------------------------------------

    // ------------------------------------------------------
    // GETTER & SETTER
    // ------------------------------------------------------

    get text()
    {
        return this.#text;
    }

    set text(value)
    {
        if (typeof value === "number" || typeof value === "string")
            this.#text = value;
        else
            console.warn("Invalid argument for text");
    }

    get color()
    {
        return this.#color;
    }

    set color(value)
    {

    }

    get position()
    {
        return this.#position;
    }

    set position(value)
    {
        if (value === "object")
        {
            this.#position.x = value.x || 0;
            this.#position.y = value.x || 0;
        }
        else
            console.warn("The position you have tried to set is not an object");
    }
}