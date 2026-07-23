// =============================================
// AXONIX POPUP.JS
// Part 3A-1
// =============================================

console.log("AXONIX popup.js loaded");

// =============================================
// CONFIG
// =============================================

const POPUP_SIZES = {
    login: {
        width: "680px",
        height: "460px"
    },
    signup: {
        width: "760px",
        height: "560px"
    }
};

// =============================================
// DOM READY
// =============================================

document.addEventListener("DOMContentLoaded", () => {

    initializeAuth();

    initializeSidebar();

    initializePopup();

});

// =============================================
// AUTH INITIALIZATION
// =============================================

function initializeAuth() {

    const token = localStorage.getItem("token");

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const menuBtn = document.getElementById("menuBtn");

    if (token) {

        if (loginBtn) loginBtn.style.display = "none";

        if (signupBtn) signupBtn.style.display = "none";

        if (menuBtn) menuBtn.style.display = "flex";

        loadUserInfo();

    }

    else {

        if (loginBtn) loginBtn.style.display = "inline-flex";

        if (signupBtn) signupBtn.style.display = "inline-flex";

        if (menuBtn) menuBtn.style.display = "none";

    }

}

// =============================================
// LOAD USER INFO
// =============================================

function loadUserInfo() {

    const username =
        localStorage.getItem("username") || "User";

    const email =
        localStorage.getItem("email") || "";

    const avatar =
        document.getElementById("avatarLetter");

    const userName =
        document.getElementById("userName");

    const userEmail =
        document.getElementById("userEmail");

    if (avatar) {

        avatar.innerHTML =
            username.charAt(0).toUpperCase();

    }

    if (userName) {

        userName.innerHTML = username;

    }

    if (userEmail) {

        userEmail.innerHTML = email;

    }

}

// =============================================
// SIDEBAR
// =============================================

function initializeSidebar() {

    const menuBtn =
        document.getElementById("menuBtn");

    const sideMenu =
        document.getElementById("sideMenu");

    const closeMenuBtn =
        document.getElementById("closeMenuBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (menuBtn && sideMenu) {

        menuBtn.onclick = () => {

            sideMenu.classList.add("show");

        };

    }

    if (closeMenuBtn && sideMenu) {

        closeMenuBtn.onclick = () => {

            sideMenu.classList.remove("show");

        };

    }

    document.addEventListener("click", (e) => {

        if (
            sideMenu &&
            sideMenu.classList.contains("show") &&
            !sideMenu.contains(e.target) &&
            menuBtn &&
            !menuBtn.contains(e.target)
        ) {

            sideMenu.classList.remove("show");

        }

    });

    if (logoutBtn) {

        logoutBtn.onclick = logout;

    }

}

// =============================================
// LOGOUT
// =============================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("username");

    localStorage.removeItem("email");

    window.location.href = "index.html";

}

// =============================================
// POPUP INITIALIZATION
// =============================================

function initializePopup() {

    const overlay =
        document.getElementById("authOverlay");

    const loginBtn =
        document.getElementById("loginBtn");

    const signupBtn =
        document.getElementById("signupBtn");

    if (loginBtn) {

        loginBtn.onclick = () => {

            openLogin();

        };

    }

    if (signupBtn) {

        signupBtn.onclick = () => {

            openSignup();

        };

    }

    if (overlay) {

        overlay.addEventListener("click", (e) => {

            if (e.target === overlay) {

                closePopup();

            }

        });

    }

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            closePopup();

        }

    });

}
// =============================================
// LOAD POPUP HTML
// =============================================

async function loadPopup(page) {

    const authContent =
        document.getElementById("authContent");

    if (!authContent) return;

    authContent.innerHTML = `

        <div class="popup-loader">

            <div class="loader"></div>

            <p>Loading...</p>

        </div>

    `;

    try {

        const response = await fetch(page);

        const html = await response.text();

        authContent.innerHTML = html;

    }

    catch (err) {

        authContent.innerHTML = `

            <div class="popup-error">

                <h3>Unable to load page</h3>

                <p>Please try again.</p>

            </div>

        `;

        console.error(err);

    }

}

// =============================================
// OPEN LOGIN
// =============================================

async function openLogin() {

    const overlay =
        document.getElementById("authOverlay");

    const popup =
        document.querySelector(".auth-popup");

    if (!overlay || !popup) return;

    popup.style.width =
        POPUP_SIZES.login.width;

    popup.style.height =
        POPUP_SIZES.login.height;

    overlay.classList.add("show");

    await loadPopup("login.html");

}

// =============================================
// OPEN SIGNUP
// =============================================

async function openSignup() {

    const overlay =
        document.getElementById("authOverlay");

    const popup =
        document.querySelector(".auth-popup");

    if (!overlay || !popup) return;

    popup.style.width =
        POPUP_SIZES.signup.width;

    popup.style.height =
        POPUP_SIZES.signup.height;

    overlay.classList.add("show");

    await loadPopup("signup.html");

}

// =============================================
// CLOSE POPUP
// =============================================

function closePopup() {

    const overlay =
        document.getElementById("authOverlay");

    const authContent =
        document.getElementById("authContent");

    if (!overlay) return;

    overlay.classList.remove("show");

    setTimeout(() => {

        if (authContent) {

            authContent.innerHTML = "";

        }

    }, 250);

}

// =============================================
// CHECK LOGIN
// =============================================

function checkLogin(page) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        openLogin();

        return;

    }

    window.location.href = page;

}

// =============================================
// LOGIN SUCCESS
// =============================================

function loginSuccess(username, email = "") {

    localStorage.setItem("username", username);

    if (email) {

        localStorage.setItem("email", email);

    }

    closePopup();

    initializeAuth();

}

// =============================================
// GLOBAL EXPORTS
// =============================================

window.openLogin = openLogin;

window.openSignup = openSignup;

window.closePopup = closePopup;

window.checkLogin = checkLogin;

window.loginSuccess = loginSuccess;

// =============================================
// END OF popup.js
// =============================================