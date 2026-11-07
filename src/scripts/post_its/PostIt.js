import { savePostItUnderHtmlElement, removeFromMap } from './post_its_map.js';
import {
    POST_IT_CLASS,
    CLASS_BACKGROUND_COLOR_PERFIX,
    CLASS_TOP_BAR_COLOR_PERFIX,
    CLASS_POST_IT_TEXT,
    CLASS_MENU_COLOR_POST_IT
} from '../config/post_it.js';

import {
    addPostItToDatabase,
    removePostItFromDatabase,
    updatePostItDataFromDatabase
} from '../database/database.js'

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const POST_ITS_PARENT = document.getElementById("board");

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
    #menuColorButton = undefined;
    #textElement = undefined;

    #id = "";

    #color = "";
    #text = "";

    #position = {
        x: 0,
        y: 0
    }

    #isInitialized = false;
    #removed = false;

    // ------------------------------------------------------
    // CONSTRUCTORS
    // ------------------------------------------------------

    /**
     * Creates a new post-it according to the given data
     * @param {String} text Post-it's text
     * @param {Object} position Post-it's position in pixels
     * @param {String} color Post-it's color
     * @param {String} id Post-it's id
     * @author Álvaro Fernández Barrero
     */
    constructor(text = "", position = {x: 0, y: 0}, color = "coral", id = undefined)
    {
        if (id !== undefined)
            this.#id = id;

        this.#generateHtmlElements();

        this.text = text;
        this.position = position;
        this.color = color;

        this.#isInitialized = true;

        if (id === undefined)
            this.ready = this.#addToDatabase();
        else
            this.ready = Promise.resolve();
    }

    // ------------------------------------------------------
    // METHODS
    // ------------------------------------------------------

    /**
     * Adds the post-it to the database
     * @author Álvaro Fernández Barrero
     */
    async #addToDatabase()
    {
        this.#id = await addPostItToDatabase(this);
    }

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

        this.#menuColorButton = document.createElement("img");
        this.#menuColorButton.src = "./src/img/menu.svg";
        this.#menuColorButton.alt = "Menu colors";
        this.#menuColorButton.className = CLASS_MENU_COLOR_POST_IT;

        savePostItUnderHtmlElement(this.#htmlElement, this);

        this.#topBar.appendChild(this.#menuColorButton);
        this.#htmlElement.appendChild(this.#topBar);
        this.#htmlElement.appendChild(this.#textElement);

        POST_ITS_PARENT.appendChild(this.#htmlElement);
    }

    /**
     * Updates the post-it in database only when it is safe to do it
     * @author Álvaro Fernández Barrero
     */
    #updateInDatabase()
    {
        if (this.#removed || !(this.#isInitialized && this.#id))
            return;

        updatePostItDataFromDatabase(this);
    }

    /**
     * Removes the post-it
     * @author Álvaro Fernández Barrero
     */
    async remove()
    {
        if (this.#removed)
            return;

        this.#removed = true;
        this.#isInitialized = false;

        removeFromMap(this.#htmlElement);
        this.#htmlElement.remove();

        if (this.#id)
            await removePostItFromDatabase(this.#id);
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
        if (this.#removed)
            return;

        if (typeof value !== "number" && typeof value !== "string")
        {
            console.warn("Invalid argument for text");
            return;
        }

        if (this.#text === value)
            return;

        this.#text = value;
        this.#textElement.textContent = value;
        this.#updateInDatabase();
    }

    get color()
    {
        return this.#color;
    }

    set color(value)
    {
        if (this.#removed)
            return;

        if (this.#color === value)
            return;

        this.#color = value;

        this.#htmlElement.classList = `${POST_IT_CLASS} ${CLASS_BACKGROUND_COLOR_PERFIX}${value}`;
        this.#topBar.className = `${CLASS_TOP_BAR_COLOR_PERFIX}${value}`;

        this.#updateInDatabase();
    }

    get position()
    {
        return this.#position;
    }

    set position(value)
    {
        if (this.#removed)
            return;

        if (typeof value !== "object" || value === null)
        {
            console.warn("The position you have tried to set is not an object");
            return;
        }

        const x = value.x ?? 0;
        const y = value.y ?? 0;

        if (this.#position.x === x && this.#position.y === y)
            return;

        this.#position.x = x;
        this.#position.y = y;

        this.#htmlElement.style.left = `${x}px`;
        this.#htmlElement.style.top = `${y}px`;

        this.#updateInDatabase();
    }

    get id()
    {
        return this.#id;
    }
}