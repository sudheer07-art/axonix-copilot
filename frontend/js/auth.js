// const API = "https://axonix-copilot.onrender.com";

// async function login(){

//     const username =
//         document.getElementById("username").value;

//     const password =
//         document.getElementById("password").value;

//     const formData = new URLSearchParams();

//     formData.append("username", username);
//     formData.append("password", password);

//     try{

//         const response = await fetch(
//             API + "/auth/login",
//             {
//                 method:"POST",
//                 headers:{
//                     "Content-Type":"application/x-www-form-urlencoded"
//                 },
//                 body:formData
//             }
//         );

//         const data = await response.json();

//         if(!response.ok){

//             document.getElementById("error").innerHTML =
//                 data.detail;

//             return;
//         }

//         localStorage.setItem(
//             "token",
//             data.access_token
//         );

//         window.location.href =
//             "dashboard.html";

//     }

//     catch(error){

//         document.getElementById("error").innerHTML =
//             "Unable to connect to server.";

//     }

// }
// ==========================================================
// AXONIX AUTH.JS
// PART 1
// ==========================================================

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

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeMenuBtn = document.getElementById("closeMenuBtn");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const avatarLetter = document.getElementById("avatarLetter");

// ==========================================================
// INITIALIZE
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeAuth();

    initializeEvents();

});

// ==========================================================
// EVENTS
// ==========================================================

function initializeEvents(){

    loginBtn?.addEventListener("click", () => {

        openLogin();

    });

    signupBtn?.addEventListener("click", () => {

        openSignup();

    });

    closeAuth?.addEventListener("click", closeModal);

    loginTab?.addEventListener("click", showLogin);

    signupTab?.addEventListener("click", showSignup);

    authModal?.addEventListener("click",(e)=>{

        if(e.target===authModal){

            closeModal();

        }

    });

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Escape"){

            closeModal();

        }

    });

    menuBtn?.addEventListener("click",()=>{

        sideMenu.classList.add("show");

    });

    closeMenuBtn?.addEventListener("click",()=>{

        sideMenu.classList.remove("show");

    });

}

// ==========================================================
// OPEN LOGIN
// ==========================================================

function openLogin(){

    authModal.classList.add("show");

    showLogin();

}

// ==========================================================
// OPEN SIGNUP
// ==========================================================

function openSignup(){

    authModal.classList.add("show");

    showSignup();

}

// ==========================================================
// CLOSE
// ==========================================================

function closeModal(){

    authModal.classList.remove("show");

}

// ==========================================================
// LOGIN TAB
// ==========================================================

function showLogin(){

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginForm.classList.add("active");
    signupForm.classList.remove("active");

}

// ==========================================================
// SIGNUP TAB
// ==========================================================

function showSignup(){

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupForm.classList.add("active");
    loginForm.classList.remove("active");

}

// ==========================================================
// LOGIN STATE
// ==========================================================

function initializeAuth(){

    const token = localStorage.getItem("token");

    if(token){

        showLoggedInUI();

    }else{

        showLoggedOutUI();

    }

}

// ==========================================================
// LOGGED OUT
// ==========================================================

function showLoggedOutUI(){

    loginBtn.style.display="inline-flex";
    signupBtn.style.display="inline-flex";

    menuBtn.style.display="none";

    userName.textContent="Welcome";
    userEmail.textContent="Please Login";
    avatarLetter.textContent="U";

}

// ==========================================================
// LOGGED IN
// ==========================================================

function showLoggedInUI(){

    loginBtn.style.display="none";
    signupBtn.style.display="none";

    menuBtn.style.display="flex";

    const username=localStorage.getItem("username") || "User";

    const email=localStorage.getItem("email") || "";

    userName.textContent=username;

    userEmail.textContent=email;

    avatarLetter.textContent=username.charAt(0).toUpperCase();

}

// ==========================================================
// PROTECTED ROUTES
// ==========================================================

function checkLogin(page){

    if(localStorage.getItem("token")){

        window.location.href=page;

        return;

    }

    pendingRedirect=page;

    openLogin();

}

// ==========================================================
// EXPORTS
// ==========================================================

window.checkLogin=checkLogin;
window.openLogin=openLogin;
window.openSignup=openSignup;
// ==========================================================
// PART 2
// LOGIN + SIGNUP + LOGOUT
// ==========================================================

// ---------- LOGIN ----------

loginForm?.addEventListener("submit", login);

async function login(e){

    e.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const message =
        document.getElementById("loginMessage");

    const button =
        loginForm.querySelector("button");

    message.innerHTML="";

    button.disabled=true;
    button.innerHTML="Signing In...";

    const formData=new URLSearchParams();

    // FastAPI OAuth2 expects username field
    formData.append("username",email);
    formData.append("password",password);

    try{

        const response=await fetch(
            API+"/auth/login",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                body:formData
            }
        );

        const data=await response.json();

        if(!response.ok){

            message.innerHTML=data.detail || "Login Failed";

            button.disabled=false;
            button.innerHTML="Login";

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

        // Use email until profile endpoint is added
        localStorage.setItem(
            "username",
            email.split("@")[0]
        );

        showLoggedInUI();

        closeModal();

        button.disabled=false;
        button.innerHTML="Login";

        if(pendingRedirect){

            window.location.href=pendingRedirect;

        }else{

            location.reload();

        }

    }

    catch(err){

        message.innerHTML=
            "Unable to connect to server.";

        button.disabled=false;
        button.innerHTML="Login";

    }

}

// ---------- SIGNUP ----------

signupForm?.addEventListener("submit",signup);

async function signup(e){

    e.preventDefault();

    const username=
        document.getElementById("signupUsername").value.trim();

    const email=
        document.getElementById("signupEmail").value.trim();

    const password=
        document.getElementById("signupPassword").value;

    const confirm=
        document.getElementById("confirmPassword").value;

    const message=
        document.getElementById("signupMessage");

    const button=
        signupForm.querySelector("button");

    message.innerHTML="";

    if(password!==confirm){

        message.innerHTML="Passwords do not match.";

        return;

    }

    button.disabled=true;
    button.innerHTML="Creating Account...";

    try{

        const response=await fetch(
            API+"/auth/register",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({

                    username:username,
                    email:email,
                    password:password

                })
            }
        );

        const data=await response.json();

        if(!response.ok){

            message.innerHTML=data.detail || "Registration Failed";

            button.disabled=false;
            button.innerHTML="Create Account";

            return;

        }

        message.style.color="#22c55e";

        message.innerHTML=
            "Account created successfully. Please login.";

        signupForm.reset();

        button.disabled=false;
        button.innerHTML="Create Account";

        showLogin();

    }

    catch(err){

        message.innerHTML=
            "Unable to connect to server.";

        button.disabled=false;
        button.innerHTML="Create Account";

    }

}

// ---------- LOGOUT ----------

const logoutBtn=document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click",logout);

function logout(){

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    sideMenu.classList.remove("show");

    showLoggedOutUI();

    location.href="index.html";

}

// ---------- AUTO CLOSE MENU ----------

document.addEventListener("click",(e)=>{

    if(
        !sideMenu.contains(e.target)
        &&
        !menuBtn.contains(e.target)
    ){

        sideMenu.classList.remove("show");

    }

});

// ---------- OPTIONAL LOADING HELPERS ----------

function showLoading(button,text){

    button.disabled=true;

    button.innerHTML=text;

}

function hideLoading(button,text){

    button.disabled=false;

    button.innerHTML=text;

}

// ==========================================================
// END OF AUTH.JS
// ==========================================================