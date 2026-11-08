import { PostIt } from './post_its/PostIt.js';
import { initializeMouseEvents } from './mouse.js';
import { initializeDatabase, loadAllPostIts } from "./database/database.js";
import { initializeColors } from "./post_its/colors.js";

window.onload = () => {
    initializeDatabase();
    loadAllPostIts();

    const newPostItButton = document.getElementById("new-post-it-button");

    newPostItButton.addEventListener("click", () => {
        new PostIt();
    });

    initializeMouseEvents();
    initializeColors();
}