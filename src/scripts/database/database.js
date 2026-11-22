import { getApp } from './firebase.js';
import {
    getFirestore,
    collection, doc,
    getDocs, addDoc, deleteDoc, updateDoc,
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
import { userId } from './authenticator.js';
import { PostIt } from '../post_its/PostIt.js';

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const COLLECTION_NAME_PREFIX = "postit";

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

let database = undefined;
let creationalSnapshot = undefined;

const postitSnapshotsMap = new Map();
const postItsMap = new Map();

// ------------------------------------------------------
// METHODS
// ------------------------------------------------------

/**
 * Initializes the database
 * @author Álvaro Fernández Barrero
 */
export function initializeDatabase()
{
    if (database !== undefined)
        return;

    database = getFirestore(getApp());
}

/**
 * Connects the creational snapshots
 * @author Álvaro Fernández Barrero
 */
export function connectCreationalSnapshot()
{
    if (typeof creationalSnapshot == "function")
        creationalSnapshot();

    creationalSnapshot = onSnapshot(collection(database, COLLECTION_NAME_PREFIX + userId), snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.doc.metadata.hasPendingWrites)
                return;
            
            const data = change.doc.data();

            switch (change.type)
            {
            case "added":
                if (!document.getElementById(change.doc.id))
                    connectSnapshot(new PostIt(data.text, data.position, data.color, change.doc.id));

                break;

            case "removed":
                const element = document.getElementById(change.doc.id);
                if (element)
                    element.remove();

                const unsubscribe = postitSnapshotsMap.get(change.doc.id);

                if (unsubscribe)
                {
                    unsubscribe();
                    postitSnapshotsMap.delete(change.doc.id);
                }

                postItsMap.delete(change.doc.id);

                break;
            }
        });
    });
}

/**
 * Connects the snapshot to the given post-it to update it when another device alters it
 * @param {PostIt} postIt Post-it instance to be updating with the snapshot
 * @author Álvaro Fernández Barrero
 */
function connectSnapshot(postIt)
{
    if (postitSnapshotsMap.has(postIt.id))
        return;

    postItsMap.set(postIt.id, postIt);

    postitSnapshotsMap.set(postIt.id, onSnapshot(doc(database, COLLECTION_NAME_PREFIX + userId, postIt.id), snapshot => {
        if (!snapshot.exists())
            return;

        if (snapshot.metadata.hasPendingWrites)
            return;

        const data = snapshot.data();

        postIt.updateProperties(data.text, data.color, data.position);
    }));
}

/**
 * Loads all the post-its
 * @returns {Array} All the loaded post-its
 * @author Álvaro Fernández Barrero
 */
export async function loadAllPostIts()
{
    if (database === undefined)
    {
        console.warn("The database was not initialized yet");
        return;
    }

    const dataFromDatabase = await getDocs(collection(database, COLLECTION_NAME_PREFIX + userId));
    const receivedData = dataFromDatabase.docs;

    const postIts = receivedData.map(element => {
        const data = element.data();
        return new PostIt(data.text, data.position, data.color, element.id);
    });
    postIts.forEach(connectSnapshot);

    return postIts;
}

/**
 * Adds a new post-it to the database
 * @param {PostIt} postIt PostIt instance to get the data from
 * @returns {String} The generated document ID
 * @author Álvaro Fernández Barrero
 */
export async function addPostItToDatabase(postIt)
{
    if (database === undefined)
    {
        console.warn("The database was not initialized yet");
        return;
    }

    const newDocument = await addDoc(collection(database, COLLECTION_NAME_PREFIX + userId), getDataFromPostIt(postIt));    
    return newDocument.id;
}

/**
 * Removes a post-it according to the given id
 * @param {String} id Post-it's id to remove
 * @author Álvaro Fernández Barrero
 */
export async function removePostItFromDatabase(id)
{
    if (database === undefined)
    {
        console.warn("The database was not initialized yet");
        return;
    }

    if (!id)
    {
        console.warn("Cannot remove post-it: missing id");
        return;
    }

    const cancelSnapshot = postitSnapshotsMap.get(id);
    if (cancelSnapshot)
    {
        cancelSnapshot();
        postitSnapshotsMap.delete(id);
    }

    await deleteDoc(doc(database, COLLECTION_NAME_PREFIX + userId, id));
}

/**
 * Updates the saved data in the database from the given post-it instance
 * @param {PostIt} postIt PostIt instance to get the data from
 * @author Álvaro Fernández Barrero
 */
export async function updatePostItDataFromDatabase(postIt)
{
    if (database === undefined)
    {
        console.warn("The database was not initialized yet");
        return;
    }

    if (!postIt.id)
    {
        console.warn("Cannot update post-it: missing id");
        return;
    }

    await updateDoc(doc(database, COLLECTION_NAME_PREFIX + userId, postIt.id), getDataFromPostIt(postIt));
}

/**
 * Gets the data from the given post-it
 * @param {PostIt} postIt PostIt instance to get the data from
 * @returns {Object} The given post-it's data
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