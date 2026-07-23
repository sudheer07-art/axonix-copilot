// ======================================================
// AXONIX Authentication
// ======================================================

(() => {

const API = "https://axonix-copilot.onrender.com";

const authModal = document.getElementById("authModal");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const closeBtn = document.getElementById("closeAuth");

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");

const logoutBtn = document.getElementById("logoutBtn");

// --------------------------------------
// OPEN / CLOSE
// --------------------------------------

function openLogin(){

    authModal.classList.add("show");

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginForm.classList.add("active");
    signupForm.classList.remove("active");

}

function openSignup(){

    authModal.classList.add("show");

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupForm.classList.add("active");
    loginForm.classList.remove("active");

}

function closeModal(){

    authModal.classList.remove("show");

    loginMessage.textContent="";
    signupMessage.textContent="";

}

loginBtn?.addEventListener("click",openLogin);

signupBtn?.addEventListener("click",openSignup);

closeBtn?.addEventListener("click",closeModal);

authModal.addEventListener("click",(e)=>{

    if(e.target===authModal){

        closeModal();

    }

});

// --------------------------------------
// TABS
// --------------------------------------

loginTab.addEventListener("click",()=>{

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginForm.classList.add("active");
    signupForm.classList.remove("active");

});

signupTab.addEventListener("click",()=>{

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupForm.classList.add("active");
    loginForm.classList.remove("active");

});

// --------------------------------------
// LOGIN
// --------------------------------------

loginForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    loginMessage.textContent="Logging in...";

    const email=document.getElementById("loginEmail").value.trim();

    const password=document.getElementById("loginPassword").value;

    try{

        const response=await fetch(`${API}/auth/login`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password
            })

        });

        const data=await response.json();

        if(!response.ok){

            throw new Error(data.detail || "Login Failed");

        }

        localStorage.setItem("token",data.access_token);

        localStorage.setItem("userEmail",email);

        loginMessage.classList.add("success");
        loginMessage.textContent="Login Successful";

        setTimeout(()=>{

            closeModal();

            updateUI();

        },700);

    }

    catch(err){

        loginMessage.classList.remove("success");

        loginMessage.textContent=err.message;

    }

});

// --------------------------------------
// SIGNUP
// --------------------------------------

signupForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    signupMessage.textContent="Creating Account...";

    const username=document.getElementById("signupUsername").value.trim();

    const email=document.getElementById("signupEmail").value.trim();

    const password=document.getElementById("signupPassword").value;

    const confirm=document.getElementById("confirmPassword").value;

    if(password!==confirm){

        signupMessage.textContent="Passwords do not match";

        return;

    }

    try{

        const response=await fetch(`${API}/auth/register`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                username,

                email,

                password

            })

        });

        const data=await response.json();

        if(!response.ok){

            throw new Error(data.detail || "Registration Failed");

        }

        signupMessage.classList.add("success");

        signupMessage.textContent="Account Created Successfully";

        setTimeout(()=>{

            loginTab.click();

        },900);

    }

    catch(err){

        signupMessage.classList.remove("success");

        signupMessage.textContent=err.message;

    }

});

// --------------------------------------
// UI
// --------------------------------------

function updateUI(){

    const token=localStorage.getItem("token");

    if(token){

        loginBtn.style.display="none";

        signupBtn.style.display="none";

    }else{

        loginBtn.style.display="inline-flex";

        signupBtn.style.display="inline-flex";

    }

}

updateUI();

// --------------------------------------
// LOGOUT
// --------------------------------------

logoutBtn?.addEventListener("click",()=>{

    localStorage.clear();

    location.reload();

});

// --------------------------------------
// Protected Pages
// --------------------------------------

window.checkLogin=function(page){

    const token=localStorage.getItem("token");

    if(!token){

        openLogin();

        return;

    }

    window.location.href=page;

}

})();