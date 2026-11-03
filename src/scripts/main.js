import { PostIt } from './PostIt.js';
import { initializeMouseEvents } from './mouse.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

window.onload = () => {
    const newPostItButton = document.getElementById("new-post-it-button");

    newPostItButton.addEventListener("click", () => {
        new PostIt();
    });

    initializeMouseEvents();
}