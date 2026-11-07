// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

const postItsMap = new Map();

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

/**
 * Removes a post-it from the map
 * @param {HTMLElement} element HTML element related to the post-it instance to remove
 * @author Álvaro Fernández Barrero
 */
export const removeFromMap = element => postItsMap.delete(element);

/**
 * Saves a post it under a HTML element
 * @param {HTMLElement} element HTML element related to the post-it instance
 * @param {PostIt} postIt Post-it to save under tge given HTML element
 * @author Álvaro Fernández Barrero
 */
export const savePostItUnderHtmlElement = (element, postIt) => postItsMap.set(element, postIt);

/**
 * Gets the post-it object related to the given HTML element
 * @param {HTMLElement} element HTML element related to a post-it instance 
 * @returns The post-it object related to the given HTML
 * @author Álvaro Fernández Barrero
 */
export const getPostItByElement = element => postItsMap.get(element);