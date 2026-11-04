import { CLASS_TOP_BAR_COLOR_PERFIX } from '../config/post_it.js';

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const MILLISECONDS_TO_WAIT_TO_START_DRAGGING = 500; 

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

let target = undefined;

let offsetX = 0;
let offsetY = 0;

// ------------------------------------------------------
// METHODS
// ------------------------------------------------------

/**
 * Checks if the given HTML element corresponds to the top bar of any post-it
 * @param {HTMLElement} element Element to check 
 * @returns True if the given element is the top bar of any post-it, false otherwise
 * @author Álvaro Fernández Barrero
 */
const isPostItTopBar = element => element.className.toLowerCase().startsWith(CLASS_TOP_BAR_COLOR_PERFIX);

/**
 * Drags the selected post-it
 * @param {Object} event Object with information about the mouse's current status
 * @author Álvaro Fernández Barrero
 */
function drag(event)
{
    target.style.left = `${Math.max(0, event.clientX - offsetX)}px`;
    target.style.top = `${Math.max(0, event.clientY - offsetY)}px`;
}

/**
 * Initializes the dragging feature
 * @author Álvaro Fernández Barrero
 */
export function initializeDraggingPostIts()
{
    document.addEventListener("mousedown", event => {
        event.preventDefault();

        if (!isPostItTopBar(event.target))
            return;

        target = event.target.parentElement;
        
        setTimeout(() => {
            if (target === undefined)
                return;
            
            offsetX = event.clientX - Number(target.style.left.slice(0, target.style.left.length - 2));
            offsetY = event.clientY - Number(target.style.top.slice(0, target.style.top.length - 2));
            
            document.addEventListener("mousemove", drag);
        }, MILLISECONDS_TO_WAIT_TO_START_DRAGGING);
    });
    
    document.addEventListener("mouseup", event => {
        event.preventDefault();
        document.removeEventListener("mousemove", drag);

        target = undefined;
    });
}
