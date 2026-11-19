import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { firebaseConfig } from './firebase_config.js';

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

let app = undefined

// ------------------------------------------------------
// METHODS
// ------------------------------------------------------

/**
 * Initializes the firestore app
 * @author Álvaro Fernández Barrero
 */
export function initializeFirebase()
{
    if (!app)
        app = initializeApp(firebaseConfig);
}

/**
 * Gets the firebase's app. If it was not created, the function will automatically create it
 * @returns Firebase's app
 * @author Álvaro Fernández Barrero
 */
export function getApp()
{
    initializeFirebase();
    return app;
}