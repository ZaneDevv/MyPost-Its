import { colorList } from './colorList.js';
import { CLASS_TOP_BAR_COLOR_PERFIX, CLASS_MENU_COLOR_POST_IT } from '../config/post_it.js';
import { getPostItByElement } from './post_its_map.js';

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const COLOR_DIV_CLASS = "color";
const OFFSET_X = 100;

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

const colorsContainer = document.getElementById("colors-container");

let target = undefined;

// ------------------------------------------------------
// METHODS
// ------------------------------------------------------

const toNumberFromPixels = data => typeof data === "string" ? Number(data.slice(0, data.length - 2)) : "";

/**
 * Set up colors
 * @author Álvaro Fernández Barrero
 */
function setUpColors()
{
    for (let color of colorList)
    {
        const div = document.createElement("div");
        div.classList = `${COLOR_DIV_CLASS} ${CLASS_TOP_BAR_COLOR_PERFIX}${color}`;
        div.id = color;

        colorsContainer.appendChild(div);
    }
}

/**
 * Opens the colors container
 * @param {Object} event Click data
 * @author Álvaro Fernández Barrero
 */
function openColorsContainer(event)
{
    if (event.target.className !== CLASS_MENU_COLOR_POST_IT)
    {
        colorsContainer.style.display = "none";
        target = undefined;

        return;
    }

    target = event.target.parentElement.parentElement;

    colorsContainer.style.display = "grid";
    colorsContainer.style.left = `${toNumberFromPixels(target.style.left) - OFFSET_X}px`;
    colorsContainer.style.top = target.style.top;
}

/**
 * Sets the selected color to the given post-it
 * @param {Object} event Click data
 * @author Álvaro Fernández Barrero
 */
function setColor(event)
{
    if (event.target.parentElement !== colorsContainer)
        return;

    if (target === undefined)
        return;

    console.log("A");

    const postIt = getPostItByElement(target);
    postIt.color = event.target.id;
}

/**
 * Fires when a click is done
 * @param {Object} event Click data
 * @author Álvaro Fernández Barrero 
 */
function onInputClick(event)
{
    setColor(event);
    openColorsContainer(event);
}

/**
 * Initializes the colors system
 * @author Álvaro Fernández Barrero
 */
export function initializeColors()
{
    setUpColors();

    document.addEventListener("mouseup", onInputClick);
    document.addEventListener("touchend", onInputClick);
}