import { PostIt } from './PostIt.js';
import { initializeMouseEvents } from './mouse.js';

window.onload = () => {
    const newPostItButton = document.getElementById("new-post-it-button");

    newPostItButton.addEventListener("click", () => {
        new PostIt();
    });

    initializeMouseEvents();
}