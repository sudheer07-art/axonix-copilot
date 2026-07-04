// // console.log("popup.js loaded");

// // document.addEventListener("DOMContentLoaded", function () {

// //     const overlay = document.getElementById("authOverlay");
// //     const frame = document.getElementById("authFrame");

// //     const loginBtn = document.getElementById("loginBtn");
// //     const signupBtn = document.getElementById("signupBtn");

// //     console.log(loginBtn);
// //     console.log(signupBtn);

// //     loginBtn.onclick = function () {

// //         console.log("Login clicked");

// //         frame.src = "login.html";
// //         const popup = document.querySelector(".auth-popup");

// //     popup.style.width = "650px";
// //     popup.style.height = "380px";


// //         overlay.classList.add("show");

// //     };

// //     signupBtn.onclick = function () {

// //         console.log("Signup clicked");

// //         frame.src = "signup.html";
// //         const popup = document.querySelector(".auth-popup");

// //     popup.style.width = "700px";
// //     popup.style.height = "480px";


// //         overlay.classList.add("show");

// //     };

// //     window.closePopup = function () {

// //         overlay.classList.remove("show");

// //         frame.src = "";

// //     };

// //     overlay.onclick = function (e) {

// //         if (e.target === overlay) {

// //             closePopup();

// //         }

// //     };

// // });
// // function checkLogin(page){

// //     const token = localStorage.getItem("token");

// //     if(token){

// //         window.location.href = page;

// //     }

// //     else{

// //         alert("Please login to access this feature.");

// //         openLogin();

// //     }

// // }
// // const menuBtn=document.getElementById("menuBtn");

// // const sideMenu=document.getElementById("sideMenu");

// // menuBtn.onclick=function(){

// //     sideMenu.classList.toggle("show");

// // }
// // document.addEventListener("DOMContentLoaded", () => {

// //     const logoutBtn = document.getElementById("logoutBtn");

// //     if (logoutBtn) {

// //         logoutBtn.onclick = function () {

// //             localStorage.removeItem("token");

// //             document.getElementById("sideMenu").classList.remove("show");

// //             document.getElementById("menuBtn").style.display = "none";

// //             document.getElementById("loginBtn").style.display = "inline-block";

// //             document.getElementById("signupBtn").style.display = "inline-block";

// //             window.location.href = "index.html";

// //         };

// //     }

// // });
// console.log("popup.js loaded");

// document.addEventListener("DOMContentLoaded", function () {

//     // ==========================
//     // ELEMENTS
//     // ==========================

//     const overlay = document.getElementById("authOverlay");
//     const frame = document.getElementById("authFrame");

//     const loginBtn = document.getElementById("loginBtn");
//     const signupBtn = document.getElementById("signupBtn");
//     const menuBtn = document.getElementById("menuBtn");

//     const sideMenu = document.getElementById("sideMenu");
//     const logoutBtn = document.getElementById("logoutBtn");

//     // ==========================
//     // CHECK LOGIN
//     // ==========================

//     const token = localStorage.getItem("token");

//     if (token) {

//         loginBtn.style.display = "none";
//         signupBtn.style.display = "none";
//         menuBtn.style.display = "flex";

//     } else {

//         loginBtn.style.display = "inline-block";
//         signupBtn.style.display = "inline-block";
//         menuBtn.style.display = "none";

//     }

//     // ==========================
//     // LOGIN POPUP
//     // ==========================

//     loginBtn.onclick = function () {

//         frame.src = "login.html";

//         const popup = document.querySelector(".auth-popup");

//         popup.style.width = "650px";
//         popup.style.height = "380px";

//         overlay.classList.add("show");

//     };

//     // ==========================
//     // SIGNUP POPUP
//     // ==========================

//     signupBtn.onclick = function () {

//         frame.src = "signup.html";

//         const popup = document.querySelector(".auth-popup");

//         popup.style.width = "700px";
//         popup.style.height = "480px";

//         overlay.classList.add("show");

//     };

//     // ==========================
//     // HAMBURGER MENU
//     // ==========================

//     // if (menuBtn) {

//     //     menuBtn.onclick = function () {

//     //         sideMenu.classList.toggle("show");

//     //     };

//     // }
//     const closeMenuBtn = document.getElementById("closeMenuBtn");

// if (menuBtn) {

//     menuBtn.onclick = function () {

//         sideMenu.classList.add("show");

//     };

// }

// if (closeMenuBtn) {

//     closeMenuBtn.onclick = function () {

//         sideMenu.classList.remove("show");

//     };

// }

//     // ==========================
//     // LOGOUT
//     // ==========================

//     if (logoutBtn) {

//         logoutBtn.onclick = function () {

//             localStorage.removeItem("token");

//             sideMenu.classList.remove("show");

//             loginBtn.style.display = "inline-block";
//             signupBtn.style.display = "inline-block";
//             menuBtn.style.display = "none";

//             alert("Logged out successfully.");

//             window.location.href = "index.html";

//         };

//     }

//     // ==========================
//     // CLOSE POPUP
//     // ==========================

//     window.closePopup = function () {

//         overlay.classList.remove("show");

//         frame.src = "";

//     };

//     // ==========================
//     // CLICK OUTSIDE
//     // ==========================

//     overlay.onclick = function (e) {

//         if (e.target === overlay) {

//             closePopup();

//         }

//     };

//     // ==========================
//     // ESC KEY
//     // ==========================

//     document.addEventListener("keydown", function (e) {

//         if (e.key === "Escape") {

//             closePopup();

//         }

//     });

// });

// // ==========================
// // OPEN LOGIN FROM ANYWHERE
// // ==========================

// function openLogin() {

//     const overlay = document.getElementById("authOverlay");
//     const frame = document.getElementById("authFrame");

//     const popup = document.querySelector(".auth-popup");

//     popup.style.width = "650px";
//     popup.style.height = "380px";

//     frame.src = "login.html";

//     overlay.classList.add("show");

// }

// // ==========================
// // OPEN SIGNUP FROM ANYWHERE
// // ==========================

// function openSignup() {

//     const overlay = document.getElementById("authOverlay");
//     const frame = document.getElementById("authFrame");

//     const popup = document.querySelector(".auth-popup");

//     popup.style.width = "700px";
//     popup.style.height = "480px";

//     frame.src = "signup.html";

//     overlay.classList.add("show");

// }

// // ==========================
// // PROTECT PAGES
// // ==========================

// function checkLogin(page) {

//     const token = localStorage.getItem("token");

//     if (token) {

//         window.location.href = page;

//     } else {

//         alert("Please login to access this feature.");

//         openLogin();

//     }

// }
// function closePopup() {

//     const overlay = document.getElementById("authOverlay");
//     const frame = document.getElementById("authFrame");

//     overlay.classList.remove("show");
//     frame.src = "";

// }
console.log("popup.js loaded");

document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // ELEMENTS
    // ==========================

    const overlay = document.getElementById("authOverlay");
    const frame = document.getElementById("authFrame");

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");

    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    // ==========================
    // CHECK LOGIN
    // ==========================

    const token = localStorage.getItem("token");
    const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const storedUsername = localStorage.getItem("username");
const storedEmail = localStorage.getItem("email");

if (token) {

    if (userName) {
        userName.innerHTML = storedUsername || "User";
    }

    if (userEmail) {
        userEmail.innerHTML = storedEmail || "";
    }

}
else{

    if (userName) {
        userName.innerHTML = "Welcome";
    }

    if (userEmail) {
        userEmail.innerHTML = "Please Login";
    }

}
const avatar = document.getElementById("avatarLetter");

if (avatar && storedUsername) {

    avatar.innerHTML = storedUsername.charAt(0).toUpperCase();

}
    if (token) {

        if (loginBtn) loginBtn.style.display = "none";

        if (signupBtn) signupBtn.style.display = "none";

        if (menuBtn) menuBtn.style.display = "flex";

    }

    else {

        if (loginBtn) loginBtn.style.display = "inline-flex";

        if (signupBtn) signupBtn.style.display = "inline-flex";

        if (menuBtn) menuBtn.style.display = "none";

    }

    // ==========================
    // LOGIN POPUP
    // ==========================

    if (loginBtn) {

        loginBtn.onclick = function (e) {

            e.preventDefault();

            frame.src = "login.html";

            const popup = document.querySelector(".auth-popup");

            popup.style.width = "650px";
            popup.style.height = "380px";

            overlay.classList.add("show");

        };

    }

    // ==========================
    // SIGNUP POPUP
    // ==========================

    if (signupBtn) {

        signupBtn.onclick = function (e) {

            e.preventDefault();

            frame.src = "signup.html";

            const popup = document.querySelector(".auth-popup");

            popup.style.width = "700px";
            popup.style.height = "480px";

            overlay.classList.add("show");

        };

    }

    // ==========================
    // HAMBURGER MENU
    // ==========================

    if (menuBtn && sideMenu) {

        menuBtn.onclick = function () {

            sideMenu.classList.add("show");
         

        };

    }

    // ==========================
    // CLOSE MENU BUTTON
    // ==========================

    if (closeMenuBtn) {

        closeMenuBtn.onclick = function () {

            sideMenu.classList.remove("show");
           

        };

    }

    // ==========================
    // CLICK OUTSIDE MENU
    // ==========================

    document.addEventListener("click", function (e) {

        if (

            sideMenu &&
            sideMenu.classList.contains("show") &&

            !sideMenu.contains(e.target) &&

            !menuBtn.contains(e.target)

        ) {

            sideMenu.classList.remove("show");

        }

    });
    // ==========================
    // LOGOUT
    // ==========================

    if (logoutBtn) {

        // logoutBtn.onclick = function () {

        //     localStorage.removeItem("token");

        //     if (sideMenu) {
        //         sideMenu.classList.remove("show");
        //     }

        //     window.location.href = "index.html";

        // };
        logoutBtn.onclick = function () {

    localStorage.removeItem("token");

    sideMenu.classList.remove("show");

    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    menuBtn.style.display = "none";

};

    }

    // ==========================
    // CLOSE POPUP
    // ==========================

    // window.closePopup = function () {

    //     overlay.classList.remove("show");

    //     frame.src = "";

    // };
    function closePopup() {

    const overlay = document.getElementById("authOverlay");
    const frame = document.getElementById("authFrame");

    overlay.classList.remove("show");
    setTimeout(() => {

        frame.src = "";

    },350);

}

window.closePopup = closePopup;

    // ==========================
    // CLICK OUTSIDE POPUP
    // ==========================

    overlay.addEventListener("click", function (e) {

        if (e.target === overlay) {

            closePopup();

        }

    });

    // ==========================
    // ESC KEY
    // ==========================

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            closePopup();

            if (sideMenu) {
                sideMenu.classList.remove("show");
            }

        }

    });

}); // END DOMContentLoaded


// ==========================
// GLOBAL FUNCTIONS
// ==========================

function closePopup() {

    const overlay = document.getElementById("authOverlay");
    const frame = document.getElementById("authFrame");

    overlay.classList.remove("show");
    frame.src = "";

}

function openLogin() {

    const overlay = document.getElementById("authOverlay");
    const frame = document.getElementById("authFrame");
    const popup = document.querySelector(".auth-popup");

    popup.style.width = "650px";
    popup.style.height = "380px";

    frame.src = "login.html";

    overlay.classList.add("show");

}

function openSignup() {

    const overlay = document.getElementById("authOverlay");
    const frame = document.getElementById("authFrame");
    const popup = document.querySelector(".auth-popup");

    popup.style.width = "700px";
    popup.style.height = "480px";

    frame.src = "signup.html";

    overlay.classList.add("show");

}

function checkLogin(page) {

    const token = localStorage.getItem("token");

    if (token) {

        window.location.href = page;

    } else {

        alert("Please login to access this feature.");

        openLogin();

    }

}