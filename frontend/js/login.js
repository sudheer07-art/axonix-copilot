// // // const API_URL = "http://127.0.0.1:8000";

// // // const loginForm = document.getElementById("loginForm");

// // // loginForm.addEventListener("submit", async function (e) {

// // //     e.preventDefault();

// // //     const username = document.getElementById("username").value.trim();

// // //     const password = document.getElementById("password").value.trim();

// // //     const message = document.getElementById("loginMessage");

// // //     message.style.color = "red";
// // //     message.innerHTML = "Logging in...";

// // //     try {

// // //         const formData = new URLSearchParams();

// // //         formData.append("username", username);
// // //         formData.append("password", password);

// // //         const response = await fetch(

// // //             `${API_URL}/auth/login`,

// // //             {

// // //                 method: "POST",

// // //                 headers: {
// // //                     "Content-Type": "application/x-www-form-urlencoded"
// // //                 },

// // //                 body: formData

// // //             }

// // //         );

// // //         const data = await response.json();

// // //         if (!response.ok) {

// // //             message.innerHTML =
// // //                 data.detail || "Invalid username or password";

// // //             return;

// // //         }

// // //         // Save JWT Token

// // //         localStorage.setItem(
// // //             "token",
// // //             data.access_token
// // //         );

// // //         message.style.color = "green";

// // //         message.innerHTML =
// // //             "Login Successful...";

// // //         setTimeout(() => {

// // //     // window.parent.loginSuccess();
// // //     window.parent.location="index.html"

// // // }, 1000);

// // //     }

// // //     catch (error) {

// // //         console.log(error);

// // //         message.innerHTML =
// // //             "Unable to connect to server.";

// // //     }

// // // });
// // // localStorage.setItem("token", data.access_token);

// // const API_URL = "http://127.0.0.1:8000";

// // const loginForm = document.getElementById("loginForm");

// // loginForm.addEventListener("submit", async function (e) {

// //     e.preventDefault();

// //     const username = document.getElementById("username").value.trim();
// //     const password = document.getElementById("password").value.trim();

// //     const message = document.getElementById("loginMessage");

// //     message.style.color = "red";
// //     message.innerHTML = "Logging in...";

// //     try {

// //         const formData = new URLSearchParams();

// //         formData.append("username", username);
// //         formData.append("password", password);

// //         const response = await fetch(`${API_URL}/auth/login`, {

// //             method: "POST",

// //             headers: {
// //                 "Content-Type": "application/x-www-form-urlencoded"
// //             },

// //             body: formData

// //         });

// //         const data = await response.json();

// //         if (!response.ok) {

// //             message.innerHTML =
// //                 data.detail || "Invalid username or password";

// //             return;

// //         }

// //         // Save JWT Token
// //         localStorage.setItem("token", data.access_token);

// //         message.style.color = "green";
// //         message.innerHTML = "Login Successful ✓";

// //         setTimeout(() => {

// //             // Close popup
// //             window.parent.closePopup();

// //             // Hide Login & Signup
// //             window.parent.document
// //                 .getElementById("loginBtn")
// //                 .style.display = "none";

// //             window.parent.document
// //                 .getElementById("signupBtn")
// //                 .style.display = "none";

// //             // Show Hamburger Menu
// //             window.parent.document
// //                 .getElementById("menuBtn")
// //                 .style.display = "inline-flex";

// //             // Redirect parent page
// //             window.parent.location.href = "index.html";

// //         }, 1000);

// //     }

// //     catch (error) {

// //         console.error(error);

// //         message.innerHTML = "Unable to connect to server.";

// //     }

// // });
// const API_URL = "http://127.0.0.1:8000";

// const loginForm = document.getElementById("loginForm");

// loginForm.addEventListener("submit", async function (e) {

//     e.preventDefault();

//     const username = document.getElementById("username").value.trim();
//     const password = document.getElementById("password").value.trim();

//     const message = document.getElementById("loginMessage");

//     message.style.color = "red";
//     message.innerHTML = "Logging in...";

//     try {

//         const formData = new URLSearchParams();

//         formData.append("username", username);
//         formData.append("password", password);

//         const response = await fetch(`${API_URL}/auth/login`, {

//             method: "POST",

//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded"
//             },

//             body: formData

//         });

//         const data = await response.json();

//         if (!response.ok) {

//             message.style.color = "red";
//             message.innerHTML =
//                 data.detail || "Invalid username or password";

//             return;

//         }

//         // Save JWT Token
//         localStorage.setItem("token", data.access_token);

//         message.style.color = "green";
//         message.innerHTML = "Login Successful ✓";

//         // setTimeout(() => {

//         //     // Close popup
//         //     window.parent.closePopup();

//         //     // Reload parent page
//         //     window.parent.location.href = "index.html";

//         // }, 1000);
//     //     setTimeout(() => {

//     // if (window.parent && typeof window.parent.closePopup === "function") {
//     //     window.parent.closePopup();
//     // }

//     setTimeout(() => {
//         window.parent.location.href = "index.html";
//     }, 1000);

// }

//     catch (error) {

//         console.error(error);

//         message.style.color = "red";
//         message.innerHTML = "Unable to connect to server.";

//     }

// })
const API_URL = "https://axonix-copilot.onrender.com";

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    message.style.color = "red";
    message.innerHTML = "Logging in...";

    try {

        const formData = new URLSearchParams();

        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            body: formData

        });

        const data = await response.json();

        if (!response.ok) {

            message.style.color = "red";
            message.innerHTML =
                data.detail || "Invalid username or password";

            return;

        }

        // ==========================
        // SAVE JWT TOKEN
        // ==========================

        localStorage.setItem("token", data.access_token);
        console.log("Saved Token:", localStorage.getItem("token"));
        localStorage.setItem("username", username);

        // ==========================
        // SUCCESS MESSAGE
        // ==========================

        message.style.color = "green";
        message.innerHTML = "Login Successful ✓";

        // ==========================
        // CLOSE POPUP & RELOAD HOME
        // ==========================

//         setTimeout(() => {

//     if (window.parent && typeof window.parent.closePopup === "function") {

//         window.parent.closePopup();
//         console.log(window.parent);
// console.log(typeof window.parent.closePopup);

//     }

//     setTimeout(() => {

//         window.parent.location.href = "index.html";

//     }, 300);

// }, 1000);
//     }
// setTimeout(() => {

//     // Close popup
//     window.parent.closePopup();

//     // Hide Login & Signup
//     window.parent.document.getElementById("loginBtn").style.display = "none";
//     window.parent.document.getElementById("signupBtn").style.display = "none";

//     // Show Hamburger
//     window.parent.document.getElementById("menuBtn").style.display = "flex";

// }, 1000);
// Login Successful
message.style.color = "green";
message.innerHTML = "Login Successful ✓";

setTimeout(() => {

    // Close popup
    if (window.parent && typeof window.parent.closePopup === "function") {
        window.parent.closePopup();
    }

    // Reload the home page so index.js loads with the new token
    setTimeout(() => {

        window.parent.location.href = "index.html";

    }, 300);

}, 1000);
    }
    catch (error) {

        console.error(error);

        message.style.color = "red";
        message.innerHTML = "Unable to connect to server.";

    }

});