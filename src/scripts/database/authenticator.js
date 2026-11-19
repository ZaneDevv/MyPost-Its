import { getApp } from './firebase.js';
import {
    getAuth, onAuthStateChanged,
    signInWithEmailAndPassword, signInWithPopup, signOut,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js"
import {
    loadAllPostIts
} from "./database.js"

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

let authentificator = undefined;

const profileImage = document.getElementById("profile-image");

const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const logInEmailAndPasswordButton = document.getElementById("login-by-email-and-password-button");
const logInGoogleButton = document.getElementById("login-with-google-button");

const boardMenu = document.getElementById("board");
const loginMenu = document.getElementById("login");

export let userId = undefined;

// ------------------------------------------------------
// METHODS
// ------------------------------------------------------

/**
 * Signs in with the given app provider
 * @param {Provider} provider App to use to authentificate 
 * @author Álvaro Fernández Barrero
 */
function signInWithApp(provider)
{
    if (!authentificator)
    {
        console.warn("The authentificator is required!");
        return;
    }

    signInWithPopup(authentificator, provider)
        .then(data => {
            console.log(data);
        })
        .catch(error => console.log(`${error.code}: ${error.message}`));
}

/**
 * Signs in with gmail
 * @author Álvaro Fernández Barrero
 */
export function signInWithGmail()
{
    signInWithApp(new GoogleAuthProvider());
}

/**
 * Signs in with a user (email) and password
 * @param {String} user User (email)
 * @param {String} password Password
 * @author Álvaro Fernández Barrero
 */
export function signInWithUserAndPassword(user, password)
{
    signInWithEmailAndPassword(authentificator, user, password)
        .then()
        .catch(error => console.log(`${error.code}: ${error.message}`));
}

/**
 * Sings the user out of the account
 * @author Álvaro Fernández Barrero
 */
export function signUserOut()
{
    signOut(authentificator)
        .then()
        .catch(console.error);
}

/**
 * Opens the login menu
 * @author Álvaro Fernández Barrero
 */
function openLoginMenu()
{
    loginMenu.style.display = "block";
    boardMenu.style.display = "none";
}

/**
 * Opens the board menu
 * @author Álvaro Fernández Barrero
 */
function openBoardMenu()
{
    boardMenu.style.display = "block";
    loginMenu.style.display = "none";
}

/**
 * Initializes the authentication enabling the needed events
 * @author Álvaro Fernández Barrero
 */
export function initializeAuthentication()
{
    authentificator = getAuth(getApp());

    logInEmailAndPasswordButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        emailInput.value = "";
        passwordInput.value = "",

        signInWithUserAndPassword(email, password);
    });

    logInGoogleButton.addEventListener("click", signInWithGmail);

    onAuthStateChanged(authentificator, user => {
        if (user)
        {
            userId = user.uid;
            openBoardMenu();

            profileImage.style.display = "block";
            profileImage.src = user.photoURL;
            profileImage.alt = `${user.displayName}'s profile`;

            loadAllPostIts();
        }
        else
        {
            profileImage.style.display = "none";
            openLoginMenu();
        }
    })
}