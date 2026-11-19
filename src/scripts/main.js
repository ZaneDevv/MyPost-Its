import { PostIt } from './post_its/PostIt.js';
import { initializeDatabase } from "./database/database.js";
import { initializeAuthentication } from "./database/authenticator.js";
import { initializeMouseEvents } from './mouse.js';
import { initializeColors } from "./post_its/colors.js";

window.onload = () => {
    initializeDatabase();
    initializeAuthentication();

    initializeMouseEvents();
    initializeColors();
    
    document.getElementById("new-post-it-button").addEventListener("click", () => { new PostIt(); });
}