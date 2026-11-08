import { getPostItByElement } from '../post_its/post_its_map.js';
import { getPostItMoving } from './mouse_dragger.js';
import { POST_IT_CLASS } from '../config/post_it.js'

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const MINIMUM_MOVEMENT = 150;
const EPSILON_Y = 100;

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

let target = undefined;

let startingX = 0;
let startingY = 0;

// ------------------------------------------------------
// METHODS
// ------------------------------------------------------

/**
 * Computes the distance between the two given numbers
 * @param {Number} x First number to compute the distance with
 * @param {Number} y Second number to compute the distance with
 * @returns The distance between the two given numbers
 * @author Álvaro Fernández Barrero
 */
const distance = (x, y) => Math.abs(x - y);

/**
 * Checks if an element has a class
 * @param {HTMLElement} element Element to check
 * @param {String} className Class to check
 * @returns True if the given HTML element has the given class, false otherwise
 * @author Álvaro Fernández Barrero
 */
function hasClass(element, className)
{
    let found = false;
    const classes = element.className.split(" ");

    for (let i = 0; !found && i < classes.length; i++)
    {
        if (classes[i] === className)
            found = true;
    }

    return found;
}

/**
 * Fires when the input is down
 * @param {HTMLElement} eventTarget HTML element under the input
 * @param {Number} x X coordinate
 * @param {Number} y Y coordinate
 * @author Álvaro Fernández Barrero 
 */
function onInputDown(eventTarget, x, y)
{
    const parent = eventTarget.parentElement;
        
    if (hasClass(parent, POST_IT_CLASS))
    {
        target = getPostItByElement(parent);
        
        startingX = x;
        startingY = y;
    }
}

/**
 * Fires when the input is up back
 * @param {Number} x X coordinate
 * @param {Number} y Y coordinate
 * @author Álvaro Fernández Barrero
 */
function onInputUp(x, y)
{
    if (!target)
        return;

    if (getPostItMoving() === target)
    {
        target = undefined;
        return;
    }
    
    if (distance(x, startingX) < MINIMUM_MOVEMENT || distance(y, startingY) >= EPSILON_Y)
        return;

    if (confirm("Are you sure you want to remove this post-it?"))
        target.remove();
    
    target = undefined;
}

/**
 * Initialize the swipper
 * @author Álvaro Fernández Barrero
 */
export function initializeSwipper()
{
    document.addEventListener("mousedown", event => onInputDown(event.target, event.clientX, event.clientY));
    document.addEventListener("touchstart", event => {
        const finger0 = event.touches[0];
        onInputDown(event.target, finger0.clientX, finger0.clientY);
    });

    document.addEventListener("mouseup", _ => { target = undefined; });
    document.addEventListener("touchend", _ => { target = undefined; });
    
    document.addEventListener("mousemove", event => onInputUp(event.clientX, event.clientY));
    document.addEventListener("touchmove", event => {
        const finger0 = event.touches[0];
        onInputUp(finger0.clientX, finger0.clientY);
    });
}