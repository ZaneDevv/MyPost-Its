import { POST_IT_CLASS, CLASS_BACKGROUND_COLOR_PERFIX, CLASS_TOP_BAR_COLOR_PERFIX, CLASS_POST_IT_TEXT } from './config/post_it.js';

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

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
    #topBar = undefined;
    #textElement = undefined;

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

        this.#topBar = document.createElement("div");
        this.#topBar.className = `${CLASS_TOP_BAR_COLOR_PERFIX}${this.color}`;

        this.#textElement = document.createElement("p");
        this.#textElement.className = CLASS_POST_IT_TEXT;
        this.#textElement.addEventListener("blur", () => this.#textElement.contentEditable = "false");
        
        this.#htmlElement.appendChild(this.#topBar);
        this.#htmlElement.appendChild(this.#textElement);
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
        if (typeof value === "object")
        {
            this.#position.x = value.x || 0;
            this.#position.y = value.x || 0;
        }
        else
            console.warn("The position you have tried to set is not an object");
    }
}