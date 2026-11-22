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

        this.ready = id ? Promise.resolve() : this.#addToDatabase();
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
        this.#htmlElement.id = this.#id;
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
        this.#htmlElement.classList.add(POST_IT_CLASS);
        this.#htmlElement.classList.add(`${CLASS_BACKGROUND_COLOR_PERFIX}${this.color}`);
        this.#htmlElement.id = this.#id;

        this.#topBar = document.createElement("div");
        this.#topBar.className = `${CLASS_TOP_BAR_COLOR_PERFIX}${this.color}`;

        this.#textElement = document.createElement("p");
        this.#textElement.className = CLASS_POST_IT_TEXT;
        this.#textElement.innerHTML = this.text;
        this.#textElement.addEventListener("blur", () => {
            this.text = this.#textElement.textContent;
            this.#textElement.contentEditable = "false";
        });

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

    /**
     * Updates the HTML text with the actual value in the instance
     * @author Álvaro Fernández Barrero
     */
    #updateText()
    {
        this.#textElement.textContent = this.#text;
    }

    /**
     * Updates the HTML color with the actual value in the instance
     * @param {String} previousColor Previous color to remove
     * @author Álvaro Fernández Barrero
     */
    #updateColor(previousColor)
    {
        this.#htmlElement.classList.replace(
            `${CLASS_BACKGROUND_COLOR_PERFIX}${previousColor}`,
            `${CLASS_BACKGROUND_COLOR_PERFIX}${this.#color}`
        );
        this.#topBar.className = `${CLASS_TOP_BAR_COLOR_PERFIX}${this.#color}`;
    }

    /**
     * Updates the HTML position with the actual value in the instance
     * @author Álvaro Fernández Barrero
     */
    #updatePosition()
    {
        this.#htmlElement.style.left = `${this.#position.x}px`;
        this.#htmlElement.style.top = `${this.#position.y}px`;
    }

    /**
     * Updates all the post-it's properties to the given ones
     * @param {String} text New text
     * @param {String} color New color
     * @param {Object} position New position
     * @author Álvaro Fernández Barrero
     */
    updateProperties(text, color, position)
    {
        const previousColor = this.#color;

        this.#text = text;
        this.#color = color;

        this.#position.x = position.x;
        this.#position.y = position.y;

        this.#updateColor(previousColor);
        this.#updateText();
        this.#updatePosition();
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

        this.#updateText();
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

        const previousColor = this.#color;

        if (previousColor === value)
            return;

        this.#color = value;

        this.#updateColor(previousColor);
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

        this.#updatePosition();
        this.#updateInDatabase();
    }

    get id()
    {
        return this.#id;
    }
}