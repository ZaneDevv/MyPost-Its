import { getApp } from './firebase.js';
import {
    getAuth, onAuthStateChanged,
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, signOut,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import { loadAllPostIts, connectCreationalSnapshot } from "./database.js";
import { removeFromMap } from '../post_its/post_its_map.js';

// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

let authentificator = undefined;

const profileImage = document.getElementById("profile-image");

const repeatPasswordContainer = document.getElementById("repeat-password");

const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const repeatPasswordInput = document.getElementById("repeat-password-input");

const noAccountButton = document.getElementById("no-account-button");
const hasAccountButton = document.getElementById("already-has-account-button");

const logInEmailAndPasswordButton = document.getElementById("login-by-email-and-password-button");
const logInGoogleButton = document.getElementById("login-with-google-button");

const signOutButton = document.getElementById("sign-out");

const boardMenu = document.getElementById("board");
const loginMenu = document.getElementById("login");

const accountErrorText = document.getElementById("account-error-text");

const newPostItButton = document.getElementById("new-post-it-button");

const errorMessages = {
    "auth/weak-password": "The password must contain at least 6 characters",
    "auth/invalid-email": "The given email is invalid"
}

export let userId = undefined;

let creatingAccount = false;

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
        .catch(error => console.log(`${error.code}: ${error.message}`));
}

/**
 * Signs in with google
 * @author Álvaro Fernández Barrero
 */
export const signInWithGoogle = () => signInWithApp(new GoogleAuthProvider());

/**
 * Creates an account with a user (email) and password
 * @param {String} user User (email)
 * @param {String} password Password
 * @author Álvaro Fernández Barrero
 */
function createAccountWithUserAndPassword(user, password)
{
    createUserWithEmailAndPassword(authentificator, user, password)
        .catch(error => accountErrorText.textContent = errorMessages[error.code]);
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
        .catch(error => console.log(`${error.code}: ${error.message}`));
}

/**
 * Sings the user out of the account
 * @author Álvaro Fernández Barrero
 */
export function signUserOut()
{
    signOut(authentificator)
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
 * Cleans the whole board up removing all post-its
 * @author Álvaro Fernández Barrero
 */
function cleanBoardUp()
{
    while (boardMenu.lastChild)
    {
        removeFromMap(boardMenu.lastChild);
        boardMenu.lastChild.remove();
    }
}

/**
 * Toggles between the logging in mode and the creating account mode
 * @author Álvaro Fernández Barrero
 */
function toggleBetweenCreatingAccountAndLogginIn()
{
    creatingAccount = !creatingAccount;

    if (creatingAccount)
    {
        noAccountButton.style.display = "none";

        hasAccountButton.style.display = "block";
        repeatPasswordContainer.style.display = "block";
    }
    else
    {
        hasAccountButton.style.display = "none";
        repeatPasswordContainer.style.display = "none";

        noAccountButton.style.display = "block";

        creatingAccount = false;
    }
}

/**
 * Function to run when the user logs in
 * @param {Object} user User that logged in's data
 * @author Álvaro Fernández Barrero
 */
async function onUserLogsIn(user)
{
    userId = user.uid;
    openBoardMenu();

    newPostItButton.style.display = "block";
    profileImage.style.display = "block";
    profileImage.src = user.photoURL;
    profileImage.alt = `${user.displayName}'s profile`;

    await loadAllPostIts();
    connectCreationalSnapshot();
}

/**
 * Function to run when the user signs out
 * @author Álvaro Fernández Barrero
 */
function onUserSignsOut()
{
    newPostItButton.style.display = "none";
    profileImage.style.display = "none";

    openLoginMenu();
    cleanBoardUp();
}

/**
 * Initializes the authentication enabling the needed events
 * @author Álvaro Fernández Barrero
 */
export function initializeAuthentication()
{
    authentificator = getAuth(getApp());

    document.addEventListener("click", event => {
        if (event.target === emailInput || event.target === passwordInput || event.target === repeatPasswordInput)
        {
            event.target.focus();
            return;
        }
        
        emailInput.blur();
        passwordInput.blur();
        repeatPasswordInput.blur();
    })

    logInGoogleButton.addEventListener("click", signInWithGoogle);
    signOutButton.addEventListener("click", signUserOut);
    profileImage.addEventListener("click", () => signOutButton.style.display = signOutButton.style.display === "none" ? "block" : "none" );

    logInEmailAndPasswordButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (creatingAccount)
        {
            const repeatedPassword = repeatPasswordInput.value.trim();

            if (password === repeatedPassword)
                createAccountWithUserAndPassword(email, password);
        }
        else
            signInWithUserAndPassword(email, password);
        
        passwordInput.value = "",
        repeatPasswordInput.value = "";
    });

    noAccountButton.addEventListener("click", toggleBetweenCreatingAccountAndLogginIn);
    hasAccountButton.addEventListener("click", toggleBetweenCreatingAccountAndLogginIn);

    onAuthStateChanged(authentificator, user => {
        signOutButton.style.display = "none";
        accountErrorText.textContent = "";
        emailInput.value = "";

        (user ? onUserLogsIn : onUserSignsOut)(user);
    });
}