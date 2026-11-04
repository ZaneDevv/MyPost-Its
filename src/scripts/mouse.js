import { initializeDraggingPostIts } from './mouse/mouse_dragger.js';
import { initializeTextChanger } from './mouse/mouse_text_changer.js';

/**
 * Initializes the mouse's events
 * @author Álvaro Fernández Barrero
 */
export function initializeMouseEvents()
{
    initializeDraggingPostIts();
    initializeTextChanger();
}