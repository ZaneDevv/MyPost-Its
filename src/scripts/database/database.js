import { firebaseConfig } from './firebase_config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import {
    getFirestore,
    collection, doc,
    getDocs, addDoc, deleteDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

import { PostIt } from '../post_its/PostIt.js'

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const COLLECTION_NAME = "postit";

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

let app = undefined;
let database = undefined;

let postItCollection = undefined;

// ------------------------------------------------------
// METHODS
// ------------------------------------------------------

/**
 * Initializes the database
 * @author Álvaro Fernández Barrero
 */
export function initializeDatabase()
{
    app = initializeApp(firebaseConfig);
    database = getFirestore(app);
    postItCollection = collection(database, COLLECTION_NAME);
}

/**
 * Loads all the post-its
 * @author Álvaro Fernández Barrero
 */
export async function loadAllPostIts()
{
    if (database === undefined)
    {
        console.warn("The database was not initialized yet");
        return;
    }

    const dataFromDatabase = await getDocs(postItCollection);
    const receivedData = dataFromDatabase.docs;

    receivedData.forEach(element => {
        const data = element.data();
        new PostIt(data.text, data.position, data.color, element.id);
    });
}

/**
 * Adds a new post-it to the database
 * @param {PostIt} postIt PostIt instance to get the data from
 * @return {Number} The id of the new post-it in the database
 * @author Álvaro Fernández Barrero
 */
export async function addPostItToDatabase(postIt)
{
    if (database === undefined)
    {
        console.warn("The database was not initialized yet");
        return;
    }

    const newDocument = await addDoc(postItCollection, getDataFromPostIt(postIt));
    return newDocument.id;
}

/**
 * Removes a post-it according to the given id
 * @param {Number} id Post-it's id to remove 
 * @author Álvaro Fernández Barrero 
 */
export function removePostItFromDatabase(id)
{
    if (database === undefined)
    {
        console.warn("The database was not initialized yet");
        return;
    }

    deleteDoc(doc(database, COLLECTION_NAME, id));
}

/**
 * Updates the saved data in the database from the given post-it instance
 * @param {PostIt} postIt PostIt instance to get the data from
 * @author Álvaro Fernández Barrero 
 */
export function updatePostItDataFromDatabase(postIt)
{
    if (database === undefined)
    {
        console.warn("The database was not initialized yet");
        return;
    }

    updateDoc(doc(database, COLLECTION_NAME, postIt.id), getDataFromPostIt(postIt));
}

/**
 * Gets the data from the given post-it
 * @param {PostIt} postIt PostIt instance to get the data from
 * @returns The given post-it's data
 * @author Álvaro Fernández Barrero 
 */
function getDataFromPostIt(postIt)
{
    return {
        text: postIt.text,
        position: postIt.position,
        color: postIt.color
    };
}