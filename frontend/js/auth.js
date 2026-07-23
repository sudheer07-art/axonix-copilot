// ==========================================================
// AXONIX AUTH.JS
// PART 1
// ==========================================================

(() => {

const API = "https://axonix-copilot.onrender.com";

let pendingRedirect = null;

// ==========================================================
// DOM
// ==========================================================

const authModal = document.getElementById("authModal");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

const closeAuth = document.getElementById("closeAuth");

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const logoutBtn = document.getElementById("logoutBtn");

// ==========================================================
// INITIALIZE
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    bindEvents();

});

// ==========================================================
// EVENTS
// ==========================================================

function bindEvents(){

    loginBtn?.addEventListener("click", openLogin);

    signupBtn?.addEventListener("click", openSignup);

    closeAuth?.addEventListener("click", closeModal);

    loginTab?.addEventListener("click", showLogin);

    signupTab?.addEventListener("click", showSignup);

    authModal?.addEventListener("click", (e)=>{

        if(e.target===authModal){

            closeModal();

        }

    });

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Escape"){

            closeModal();

        }

    });

    logoutBtn?.addEventListener("click", logout);

    loginForm?.addEventListener("submit", login);

    signupForm?.addEventListener("submit", signup);

}

// ==========================================================
// MODAL
// ==========================================================

function openLogin(){

    authModal.classList.add("show");

    showLogin();

}

function openSignup(){

    authModal.classList.add("show");

    showSignup();

}

function closeModal(){

    authModal.classList.remove("show");

}

// ==========================================================
// TABS
// ==========================================================

function showLogin(){

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginForm.classList.add("active");
    signupForm.classList.remove("active");

}

function showSignup(){

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupForm.classList.add("active");
    loginForm.classList.remove("active");

}

// ==========================================================
// HELPERS
// ==========================================================

function getLoginButton(){

    return loginForm.querySelector("button");

}

function getSignupButton(){

    return signupForm.querySelector("button");

}

function showMessage(id,text,color="#ef4444"){

    const el=document.getElementById(id);

    if(!el) return;

    el.style.color=color;

    el.innerHTML=text;

}

function clearMessages(){

    showMessage("loginMessage","");

    showMessage("signupMessage","");

}

// ==========================================================
// PROTECTED ROUTES
// ==========================================================

window.checkLogin=function(page){

    const token=localStorage.getItem("token");

    if(token){

        window.location.href=page;

        return;

    }

    pendingRedirect=page;

    openLogin();

};

window.openLogin=openLogin;

window.openSignup=openSignup;
// ==========================================================
// LOGIN
// ==========================================================

async function login(e){

    e.preventDefault();

    clearMessages();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const button = getLoginButton();

    button.disabled = true;
    button.innerHTML = "Signing In...";

    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    try{

        const response = await fetch(
            API + "/auth/login",
            {
                method: "POST",
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                body: formData
            }
        );

        const data = await response.json();

        if(!response.ok){

            showMessage(
                "loginMessage",
                data.detail || "Login Failed"
            );

            button.disabled = false;
            button.innerHTML = "Login";

            return;

        }

        localStorage.setItem(
            "token",
            data.access_token
        );

        localStorage.setItem(
            "email",
            email
        );

        localStorage.setItem(
            "username",
            email.split("@")[0]
        );

        closeModal();

        button.disabled = false;
        button.innerHTML = "Login";

        if(pendingRedirect){

            window.location.href = pendingRedirect;

        }else{

            location.reload();

        }

    }

    catch(err){

        showMessage(
            "loginMessage",
            "Unable to connect to server."
        );

        button.disabled = false;
        button.innerHTML = "Login";

    }

}

// ==========================================================
// SIGNUP
// ==========================================================

async function signup(e){

    e.preventDefault();

    clearMessages();

    const username =
        document.getElementById("signupUsername").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const password =
        document.getElementById("signupPassword").value;

    const confirm =
        document.getElementById("confirmPassword").value;

    if(password !== confirm){

        showMessage(
            "signupMessage",
            "Passwords do not match."
        );

        return;

    }

    const button = getSignupButton();

    button.disabled = true;
    button.innerHTML = "Creating Account...";

    try{

        const response = await fetch(

            API + "/auth/register",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    username,
                    email,
                    password

                })

            }

        );

        const data = await response.json();

        if(!response.ok){

            showMessage(

                "signupMessage",

                data.detail || "Registration Failed"

            );

            button.disabled = false;
            button.innerHTML = "Create Account";

            return;

        }

        showMessage(

            "signupMessage",

            "Account created successfully. Please login.",

            "#22c55e"

        );

        signupForm.reset();

        button.disabled = false;
        button.innerHTML = "Create Account";

        showLogin();

    }

    catch(err){

        showMessage(

            "signupMessage",

            "Unable to connect to server."

        );

        button.disabled = false;
        button.innerHTML = "Create Account";

    }

}

// ==========================================================
// LOGOUT
// ==========================================================

function logout(){

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    location.href = "index.html";

}

// ==========================================================
// END
// ==========================================================

})();