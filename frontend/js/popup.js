// ==========================================================
// AXONIX POPUP.JS
// ==========================================================

console.log("AXONIX Popup Loaded");

// ==========================================================
// DOM READY
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeAuth();

    initializePopup();

    initializeSidebar();

});

// ==========================================================
// AUTH STATE
// ==========================================================

function initializeAuth() {

    const token = localStorage.getItem("token");

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const menuBtn = document.getElementById("menuBtn");

    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const avatar = document.getElementById("avatarLetter");

    if (token) {

        loginBtn.style.display = "none";
        signupBtn.style.display = "none";
        menuBtn.style.display = "flex";

        const username = localStorage.getItem("username") || "User";
        const email = localStorage.getItem("email") || "";

        if (userName) userName.textContent = username;
        if (userEmail) userEmail.textContent = email;
        if (avatar) avatar.textContent = username.charAt(0).toUpperCase();

    }

    else {

        loginBtn.style.display = "inline-flex";
        signupBtn.style.display = "inline-flex";
        menuBtn.style.display = "none";

        if (userName) userName.textContent = "Welcome";
        if (userEmail) userEmail.textContent = "Please Login";
        if (avatar) avatar.textContent = "U";

    }

}

// ==========================================================
// POPUP
// ==========================================================

function initializePopup() {

    const overlay = document.getElementById("authOverlay");
    const closeBtn = document.getElementById("closePopup");

    if (closeBtn) {

        closeBtn.onclick = closePopup;

    }

    overlay.addEventListener("click", e => {

        if (e.target === overlay) {

            closePopup();

        }

    });

    document.addEventListener("keydown", e => {

        if (e.key === "Escape") {

            closePopup();

        }

    });

}

// ==========================================================
// LOAD HTML
// ==========================================================

async function loadPopup(page) {

    const container = document.getElementById("authContainer");

    container.innerHTML = `

        <div class="popup-loader">

            <div class="loader"></div>

            <p>Loading...</p>

        </div>

    `;

    try {

        const response = await fetch(page);

        const html = await response.text();

        container.innerHTML = html;

    }

    catch (err) {

        console.error(err);

        container.innerHTML = `

            <div class="popup-error">

                <h3>Unable to load page</h3>

                <p>Please try again.</p>

            </div>

        `;

    }

}

// ==========================================================
// LOGIN
// ==========================================================

async function openLogin() {

    document
        .getElementById("authOverlay")
        .classList
        .add("show");

    await loadPopup("login.html");

}

// ==========================================================
// SIGNUP
// ==========================================================

async function openSignup() {

    document
        .getElementById("authOverlay")
        .classList
        .add("show");

    await loadPopup("signup.html");

}

// ==========================================================
// CLOSE
// ==========================================================

function closePopup() {

    document
        .getElementById("authOverlay")
        .classList
        .remove("show");

    setTimeout(() => {

        document
            .getElementById("authContainer")
            .innerHTML = "";

    },300);

}

// ==========================================================
// SIDEBAR
// ==========================================================

function initializeSidebar() {

    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const closeMenu = document.getElementById("closeMenuBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if(menuBtn){

        menuBtn.onclick=()=>{

            sideMenu.classList.add("show");

        };

    }

    if(closeMenu){

        closeMenu.onclick=()=>{

            sideMenu.classList.remove("show");

        };

    }

    if(logoutBtn){

        logoutBtn.onclick=logout;

    }

}

// ==========================================================
// LOGOUT
// ==========================================================

function logout(){

    localStorage.clear();

    window.location.href="index.html";

}

// ==========================================================
// LOGIN SUCCESS
// ==========================================================

function loginSuccess(username,email=""){

    localStorage.setItem("username",username);

    if(email){

        localStorage.setItem("email",email);

    }

    closePopup();

    initializeAuth();

}

// ==========================================================
// PROTECTED PAGE
// ==========================================================

function checkLogin(page){

    const token=localStorage.getItem("token");

    if(token){

        window.location.href=page;

        return;

    }

    openLogin();

}

// ==========================================================
// EXPORTS
// ==========================================================

window.openLogin=openLogin;
window.openSignup=openSignup;
window.closePopup=closePopup;
window.checkLogin=checkLogin;
window.loginSuccess=loginSuccess;