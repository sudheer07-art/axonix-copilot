// ==========================================================
// AXONIX POPUP.JS
// ==========================================================

console.log("AXONIX Popup Loaded");

document.addEventListener("DOMContentLoaded", () => {
    initializeAuth();
    initializePopup();
    initializeSidebar();
});

// ================= AUTH =================

function initializeAuth() {

    const token = localStorage.getItem("access_token");

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const menuBtn = document.getElementById("menuBtn");

    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const avatar = document.getElementById("avatarLetter");

    if (token) {

        if(loginBtn) loginBtn.style.display="none";
        if(signupBtn) signupBtn.style.display="none";
        if(menuBtn) menuBtn.style.display="flex";

        const username = localStorage.getItem("username") || "User";
        const email = localStorage.getItem("email") || "";

        if(userName) userName.textContent=username;
        if(userEmail) userEmail.textContent=email;
        if(avatar) avatar.textContent=username.charAt(0).toUpperCase();

    } else {

        if(loginBtn) loginBtn.style.display="inline-flex";
        if(signupBtn) signupBtn.style.display="inline-flex";
        if(menuBtn) menuBtn.style.display="none";

    }

}

// ================= POPUP =================

function initializePopup(){

    const overlay=document.getElementById("authOverlay");
    const closeBtn=document.getElementById("closePopup");

    document.getElementById("loginBtn")?.addEventListener("click",openLogin);
    document.getElementById("signupBtn")?.addEventListener("click",openSignup);

    closeBtn?.addEventListener("click",closePopup);

    overlay?.addEventListener("click",(e)=>{

        if(e.target===overlay){

            closePopup();

        }

    });

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Escape"){

            closePopup();

        }

    });

}

// ================= LOAD PAGE =================

async function loadPopup(page){

    const container=document.getElementById("authContainer");

    container.innerHTML=`
        <div class="popup-loader">
            <div class="loader"></div>
            <p>Loading...</p>
        </div>
    `;

    try{

        const res=await fetch(page);

        const html=await res.text();

        container.innerHTML=html;

        // IMPORTANT
        // Execute JS manually because innerHTML ignores <script>

        if(page==="login.html"){

            loadScript("js/login.js");

        }

        if(page==="signup.html"){

            loadScript("js/signup.js");

        }

    }catch(err){

        container.innerHTML="<h3>Unable to load page</h3>";

    }

}

function loadScript(src){

    document.getElementById("dynamicScript")?.remove();

    const script=document.createElement("script");

    script.src=src;

    script.id="dynamicScript";

    document.body.appendChild(script);

}

// ================= OPEN =================

async function openLogin(){

    document.getElementById("authOverlay").classList.add("show");

    await loadPopup("login.html");

}

async function openSignup(){

    document.getElementById("authOverlay").classList.add("show");

    await loadPopup("signup.html");

}

// ================= CLOSE =================

function closePopup(){

    document.getElementById("authOverlay").classList.remove("show");

    setTimeout(()=>{

        document.getElementById("authContainer").innerHTML="";

        document.getElementById("dynamicScript")?.remove();

    },300);

}

// ================= SIDEBAR =================

function initializeSidebar(){

    const menu=document.getElementById("menuBtn");
    const side=document.getElementById("sideMenu");
    const close=document.getElementById("closeMenuBtn");

    menu?.addEventListener("click",()=>{

        side.classList.add("show");

    });

    close?.addEventListener("click",()=>{

        side.classList.remove("show");

    });

    document.getElementById("logoutBtn")?.addEventListener("click",logout);

}

// ================= LOGOUT =================

function logout(){

    localStorage.clear();

    location.reload();

}

// ================= LOGIN SUCCESS =================

function loginSuccess(username,email){

    localStorage.setItem("username",username);

    localStorage.setItem("email",email);

    closePopup();

    initializeAuth();

}

// ================= PROTECTED =================

function checkLogin(page){

    if(localStorage.getItem("access_token")){

        window.location.href=page;

    }else{

        openLogin();

    }

}

// ================= EXPORTS =================

window.openLogin=openLogin;
window.openSignup=openSignup;
window.closePopup=closePopup;
window.loginSuccess=loginSuccess;
window.checkLogin=checkLogin;