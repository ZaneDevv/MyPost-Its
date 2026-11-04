import { initializeDraggingPostIts } from './mouse/mouse_dragger.js';
import { initializeTextChanger } from './mouse/mouse_text_changer.js';
import { initializeSwipper } from './mouse/mouse_swipe.js';

/**
 * Initializes the mouse's events
 * @author Álvaro Fernández Barrero
 */
export function initializeMouseEvents()
{
    initializeDraggingPostIts();
    initializeTextChanger();
    initializeSwipper();
}