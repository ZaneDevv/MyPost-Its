import { CLASS_POST_IT_TEXT } from '../config/post_it.js';

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const MILLISECONDS_TO_WAIT_BETWEEN_CLICK = 300;

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

let lastClick = 0;

let target = undefined;

// ------------------------------------------------------
// METHODS
// ------------------------------------------------------

/**
 * Checks if the given HTML element corresponds to the top bar of any post-it
 * @param {HTMLElement} element Element to check 
 * @returns True if the given element is the top bar of any post-it, false otherwise
 * @author Álvaro Fernández Barrero
 */
const isPostItText = element => element.className === CLASS_POST_IT_TEXT;

/**
 * Enables the text editing in the given post-it
 * @author Álvaro Fernández Barrero
 */
function enableEditing()
{
    if (!target)
        return;

    target.contentEditable = "true";
    target.focus();
}

/**
 * Disables the text editing in the given post-it
 * @author Álvaro Fernández Barrero
 */
function disableEditing()
{
    if (!target)
        return;

    target.blur();
    target = undefined;
}

/**
 * Runs a method on the second input
 * @param {Object} event Click/touch data
 * @author Álvaro Fernández Barrero
 */
function onTap(event)
{
    if (event.target !== target)
        disableEditing();

    if (!isPostItText(event.target))
        return;

    target = event.target;

    const now = Date.now();
    const deltaTime = now - lastClick;

    if (deltaTime <= MILLISECONDS_TO_WAIT_BETWEEN_CLICK)
        enableEditing();

    lastClick = now;
}

/**
 * Initializes the text changer
 * @author Álvaro Fernández Barrero
 */
export function initializeTextChanger()
{
    document.addEventListener("mouseup", onTap);
    document.addEventListener("touchstart", onTap);
}