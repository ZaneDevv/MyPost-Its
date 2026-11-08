import { CLASS_TOP_BAR_COLOR_PERFIX } from '../config/post_it.js';
import { getPostItByElement } from '../post_its/post_its_map.js';

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const MILLISECONDS_TO_WAIT_TO_START_DRAGGING = 500; 

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

let target = undefined;
let movingTarget = undefined;

let offsetX = 0;
let offsetY = 0;

// ------------------------------------------------------
// METHODS
// ------------------------------------------------------

/**
 * Gets the HTML post-it element that is currently being dragged
 * @returns The post-it that is being currently dragged
 * @author Álvaro Fernández Barrero
 */
export const getPostItMoving = () => movingTarget;

/**
 * Checks if the given HTML element corresponds to the top bar of any post-it
 * @param {HTMLElement} element Element to check 
 * @returns True if the given element is the top bar of any post-it, false otherwise
 * @author Álvaro Fernández Barrero
 */
const isPostItTopBar = element => element.className.toLowerCase().startsWith(CLASS_TOP_BAR_COLOR_PERFIX);

/**
 * Sets a new position to the target post-it
 * @param {Number} x X coordinate
 * @param {Number} y Y coordinate
 * @author Álvaro Fernández Barrero
 */
function setPositionToTarget(x, y)
{
    if (!target)
        return;

    target.position = {x: x, y: y};
}

/**
 * Drags the selected post-it (for mouse)
 * @param {Object} event Object with information about the mouse's current status
 * @author Álvaro Fernández Barrero
 */
function dragWithMouse(event)
{
    if (!(event.clientX && event.clientY))
        return;

    setPositionToTarget(Math.max(0, event.clientX - offsetX), Math.max(0, event.clientY - offsetY));
}

/**
 * Drags the selected post-it (for touch)
 * @param {Object} event Object with information about the mouse's current status
 * @author Álvaro Fernández Barrero
 */
function dragWithTouch(event)
{
    if (!event.touches)
        return;

    const finger = event.touches[0];
    setPositionToTarget(Math.max(0, finger.clientX - offsetX), Math.max(0, finger.clientY - offsetY));
}

/**
 * Method to fire when a key input is down
 * @param {HTMLElement} inputTarget HTML element under the input 
 * @param {Number} x X-cooridnate
 * @param {Number} y Y-coordinate
 * @author Álvaro Fernández Barrero
 */
function onInputDown(inputTarget, x, y)
{
    if (!isPostItTopBar(inputTarget))
        return;
    
    target = getPostItByElement(inputTarget.parentElement);
    
    setTimeout(() => {
        if (target === undefined)
            return;
        
        movingTarget = target;
        
        offsetX = x - target.position.x;
        offsetY = y - target.position.y;
        
        document.addEventListener("mousemove", dragWithMouse);
        document.addEventListener("touchmove", dragWithTouch);
    }, MILLISECONDS_TO_WAIT_TO_START_DRAGGING);
}

/**
 * Method to fire when a key input is up back
 * @author Álvaro Fernández Barrero
 */
function onInputUp()
{
    document.removeEventListener("mousemove", dragWithMouse);
    document.removeEventListener("touchmove", dragWithTouch);

    movingTarget = undefined;
    target = undefined;
}

/**
 * Initializes the dragging feature
 * @author Álvaro Fernández Barrero
 */
export function initializeDraggingPostIts()
{
    document.addEventListener("mousedown", event => {
        event.preventDefault();
        onInputDown(event.target, event.clientX, event.clientY);
    });

    document.addEventListener("touchstart", event => {
        const finger = event.touches[0];
        onInputDown(event.target, finger.clientX, finger.clientY);
    })
    
    document.addEventListener("mouseup", event => {
        event.preventDefault();
        onInputUp();
    });

    document.addEventListener("touchend", onInputUp);
}
