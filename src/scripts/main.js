import { PostIt } from './PostIt.js';

window.onload = () => {
    const newPostItButton = document.getElementById("new-post-it-button");

    newPostItButton.addEventListener("click", () => {
        new PostIt();
    })
}