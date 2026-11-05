import { getPostItByElement } from '../post_its/post_its_map.js';
import { POST_IT_CLASS } from '../config/post_it.js'

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const MINIMUM_MOVEMENT = 50;

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

let target = undefined;
let startingX = 0;

// ------------------------------------------------------
// METHODS
// ------------------------------------------------------

/**
 * Checks if an element has a tag
 * @param {HTMLElement} element Element to check
 * @param {String} tag Tag to check
 * @author Álvaro Fernández Barrero
 */
function hasTag(element, tag)
{
    const tags = element.className.split(" ");

    for (let currentTag of tags)
    {
        if (currentTag === tag)
            return true;
    }

    return false;
}

/**
 * Initialize the swipper
 * @author Álvaro Fernández Barrero
 */
export function initializeSwipper()
{
    document.addEventListener("mousedown", event => {
        const parent = event.target.parentElement;
        
        if (hasTag(parent, POST_IT_CLASS))
        {
            target = parent;
            startingX = event.clientX;
        }
    });
    
    document.addEventListener("mousemove", event => {
        if (!target)
            return;
    
        const deltaX = event.clientX - startingX;
        
        if (Math.abs(deltaX) < MINIMUM_MOVEMENT)
            return;
    
        if (confirm("Are you sure you want to remove this post-it?"))
        {
            getPostItByElement(target).remove();
            target = undefined;
        }
    });
}