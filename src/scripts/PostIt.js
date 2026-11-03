// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const POST_IT_CLASS = "post-it";

const CLASS_BACKGROUND_COLOR_PERFIX = "background-";
const CLASS_TOP_BAR_COLOR_PERFIX = "top-bar-";

const POST_ITS_PARENT = document.querySelectorAll("main")[0];

// ------------------------------------------------------
// CLASSES
// ------------------------------------------------------

export class PostIt
{
    // ------------------------------------------------------
    // ATTRIBUTES
    // ------------------------------------------------------

    #htmlElement = undefined;

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
    constructor(text = "", position = {x: 0, y: 0}, color = "coral")
    {
        this.text = text;
        this.position = position;
        this.color = color;

        this.#generateHtmlElements();
    }

    // ------------------------------------------------------
    // METHODS
    // ------------------------------------------------------

    /**
     * Creates a new HTML element for the post-it
     * @author Álvaro Fernández Barrero
     */
    #generateHtmlElements()
    {
        if (this.#htmlElement !== undefined)
            return;

        this.#htmlElement = document.createElement("div");
        this.#htmlElement.classList = `${POST_IT_CLASS} ${CLASS_BACKGROUND_COLOR_PERFIX}${this.color}`;

        const topBar = document.createElement("div");
        topBar.className = `${CLASS_TOP_BAR_COLOR_PERFIX}${this.color}`;

        const text = document.createElement("p");
        
        this.#htmlElement.appendChild(topBar);
        this.#htmlElement.appendChild(text);
        POST_ITS_PARENT.appendChild(this.#htmlElement);
    }

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
        this.#color = value;
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