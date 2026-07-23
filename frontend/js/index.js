// console.log("index.js loaded");
// function showPopup(message){

//     const popup = document.getElementById("loadingPopup");

//     if(!popup) return;

//     document.getElementById("loadingMessage").textContent = message;

//     popup.classList.add("show");

// }

// function hidePopup(){

//     const popup = document.getElementById("loadingPopup");

//     if(!popup) return;

//     popup.classList.remove("show");

// }

// async function loadResumeAnalysis() {

//     console.log("Function Started");

//     const token = localStorage.getItem("token");

//     console.log("Token:", token);

//     if (!token) {
//         console.log("No token found");
//         return;
//     }
   
//     try {
//          showPopup(
//         "Please wait while AXONIX AI updates your dashboard..."
//     );

//         console.log("Sending request...");

//         const response = await fetch(
//             "https://axonix-copilot.onrender.com/dashboard/",
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             }
//         );
//         showPopup(
//     "Please wait while AXONIX AI updates your dashboard..."
// );
//         console.log("Fetch completed");

//         console.log("Response Status:", response.status);

//         if (!response.ok) {
//             throw new Error("Failed to load dashboard");
//         }

//         const data = await response.json();
//         console.log("JSON parsed");

//         console.log("Dashboard Data:", data);

//         // ATS Score
//         const ats = document.getElementById("atsScore");
//         if (ats) {
//             ats.innerHTML = `${Math.round(data.ats_score)}%`;
//         }

//         // Skills Count
//         const skills = document.getElementById("skillsCount");
//         if (skills) {
//             skills.innerHTML = data.skills.length;
//         }

//         // Job Matches
//         const jobs = document.getElementById("jobCount");
//         if (jobs) {
//             jobs.innerHTML = data.job_matches;
//         }

//         // AI Summary
//         const summary = document.getElementById("summary");
//         if (summary) {

//             if (data.summary && data.summary.trim() !== "") {
//                 summary.innerHTML = data.summary;
//             }
//             else if (data.suggestions.length > 0) {
//                 summary.innerHTML = data.suggestions[0];
//             }
//             else {
//                 summary.innerHTML = "No suggestions available.";
//             }

//         }

//         console.log("Dashboard Updated Successfully");
//         hidePopup();
       



//     }
//    catch (error) {
//     console.error("FULL ERROR:", error);
//         hidePopup();
// }

// }

// window.addEventListener("load", loadResumeAnalysis);
// ======================================================
// AXONIX - index.js
// Part 1
// Configuration + DOM + Initialization
// ======================================================

console.log("AXONIX Index Loaded");

// ======================================================
// CONFIG
// ======================================================

const API = "https://axonix-copilot.onrender.com";

// ======================================================
// DOM ELEMENTS
// ======================================================

// Navbar
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const menuBtn = document.getElementById("menuBtn");

// Sidebar
const sideMenu = document.getElementById("sideMenu");
const closeMenuBtn = document.getElementById("closeMenuBtn");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const avatarLetter = document.getElementById("avatarLetter");

// Loading Popup
const loadingPopup = document.getElementById("loadingPopup");
const loadingMessage = document.getElementById("loadingMessage");

// Dashboard Preview
const atsScore = document.getElementById("atsScore");
const skillsCount = document.getElementById("skillsCount");
const jobCount = document.getElementById("jobCount");
const summary = document.getElementById("summary");

// ======================================================
// APPLICATION START
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Initializing AXONIX...");

    initializeNavbar();

    initializeSidebar();

    loadResumeAnalysis();

});

// ======================================================
// NAVBAR
// ======================================================

function initializeNavbar() {

    const token = localStorage.getItem("token");

    if (token) {

        showLoggedInNavbar();

    } else {

        showLoggedOutNavbar();

    }

}

// ======================================================
// LOGGED OUT NAVBAR
// ======================================================

function showLoggedOutNavbar() {

    if (loginBtn)
        loginBtn.style.display = "inline-flex";

    if (signupBtn)
        signupBtn.style.display = "inline-flex";

    if (menuBtn)
        menuBtn.style.display = "none";

}

// ======================================================
// LOGGED IN NAVBAR
// ======================================================

function showLoggedInNavbar() {

    if (loginBtn)
        loginBtn.style.display = "none";

    if (signupBtn)
        signupBtn.style.display = "none";

    if (menuBtn)
        menuBtn.style.display = "flex";

    const username =
        localStorage.getItem("username") || "User";

    const email =
        localStorage.getItem("email") || "";

    if (userName)
        userName.textContent = username;

    if (userEmail)
        userEmail.textContent = email;

    if (avatarLetter)
        avatarLetter.textContent =
            username.charAt(0).toUpperCase();

}

// ======================================================
// REFRESH NAVBAR
// ======================================================

function refreshNavbar() {

    initializeNavbar();

}

// ======================================================
// HELPERS
// ======================================================

function getToken() {

    return localStorage.getItem("token");

}

function isLoggedIn() {

    return !!getToken();

}
// ======================================================
// AXONIX - index.js
// Part 2
// Sidebar + Loading Popup + Utilities
// ======================================================

// ======================================================
// SIDEBAR
// ======================================================

function initializeSidebar() {

    if (menuBtn) {

        menuBtn.addEventListener("click", openSidebar);

    }

    if (closeMenuBtn) {

        closeMenuBtn.addEventListener("click", closeSidebar);

    }

    document.addEventListener("click", outsideSidebarClick);

}

// ======================================================
// OPEN SIDEBAR
// ======================================================

function openSidebar() {

    if (!sideMenu) return;

    sideMenu.classList.add("show");

}

// ======================================================
// CLOSE SIDEBAR
// ======================================================

function closeSidebar() {

    if (!sideMenu) return;

    sideMenu.classList.remove("show");

}

// ======================================================
// CLICK OUTSIDE
// ======================================================

function outsideSidebarClick(e) {

    if (!sideMenu) return;

    if (!menuBtn) return;

    if (
        !sideMenu.contains(e.target) &&
        !menuBtn.contains(e.target)
    ) {

        closeSidebar();

    }

}

// ======================================================
// LOADING POPUP
// ======================================================

function showPopup(message = "Loading...") {

    if (!loadingPopup) return;

    loadingMessage.textContent = message;

    loadingPopup.classList.add("show");

}

// ======================================================
// HIDE POPUP
// ======================================================

function hidePopup() {

    if (!loadingPopup) return;

    loadingPopup.classList.remove("show");

}

// ======================================================
// RESET DASHBOARD
// ======================================================

function resetDashboardPreview() {

    if (atsScore)
        atsScore.textContent = "0%";

    if (skillsCount)
        skillsCount.textContent = "0";

    if (jobCount)
        jobCount.textContent = "0";

    if (summary)
        summary.textContent =
            "Login to analyze your resume with AXONIX AI.";

}

// ======================================================
// LOGOUT UI
// ======================================================

function clearUserUI() {

    resetDashboardPreview();

    showLoggedOutNavbar();

    closeSidebar();

}

// ======================================================
// PAGE REDIRECT
// ======================================================

function goTo(page) {

    window.location.href = page;

}

// ======================================================
// SAFE TEXT UPDATE
// ======================================================

function updateText(element, value) {

    if (!element) return;

    element.textContent = value;

}

// ======================================================
// SAFE HTML UPDATE
// ======================================================

function updateHTML(element, value) {

    if (!element) return;

    element.innerHTML = value;

}

// ======================================================
// FORMAT PERCENTAGE
// ======================================================

function formatPercentage(value) {

    return `${Math.round(value)}%`;

}

// ======================================================
// FORMAT NUMBER
// ======================================================

function formatNumber(value) {

    return Number(value).toLocaleString();

}

// ======================================================
// DEBUG LOGGER
// ======================================================

function log(...data) {

    console.log("[AXONIX]", ...data);

}
// ======================================================
// AXONIX - index.js
// Part 3
// Dashboard Preview
// ======================================================

async function loadResumeAnalysis() {

    log("Loading Dashboard Preview...");

    // Check Login
    if (!isLoggedIn()) {

        log("User not logged in");

        resetDashboardPreview();

        return;

    }

    const token = getToken();

    showPopup(
        "🤖 AXONIX AI is updating your dashboard..."
    );

    try {

        const response = await fetch(
            API + "/dashboard/",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // -------------------------------
        // Unauthorized
        // -------------------------------

        if (response.status === 401) {

            log("Session Expired");

            localStorage.clear();

            clearUserUI();

            hidePopup();

            return;

        }

        if (!response.ok) {

            throw new Error(
                "Dashboard request failed."
            );

        }

        const data = await response.json();

        log("Dashboard Loaded", data);

        updateDashboard(data);

    }

    catch (error) {

        console.error(error);

        if (summary) {

            summary.innerHTML =
                "Unable to load dashboard.";

        }

    }

    finally {

        hidePopup();

    }

}

// ======================================================
// UPDATE DASHBOARD
// ======================================================

function updateDashboard(data) {

    updateATS(data);

    updateSkills(data);

    updateJobs(data);

    updateSummary(data);

}

// ======================================================
// ATS SCORE
// ======================================================

function updateATS(data) {

    if (!atsScore) return;

    atsScore.textContent =
        formatPercentage(
            data.ats_score || 0
        );

}

// ======================================================
// SKILLS
// ======================================================

function updateSkills(data) {

    if (!skillsCount) return;

    const count =
        data.skills
            ? data.skills.length
            : 0;

    skillsCount.textContent = count;

}

// ======================================================
// JOB MATCHES
// ======================================================

function updateJobs(data) {

    if (!jobCount) return;

    jobCount.textContent =
        data.job_matches || 0;

}

// ======================================================
// AI SUMMARY
// ======================================================

function updateSummary(data) {

    if (!summary) return;

    if (

        data.summary &&
        data.summary.trim() !== ""

    ) {

        summary.innerHTML =
            data.summary;

        return;

    }

    if (

        data.suggestions &&
        data.suggestions.length

    ) {

        summary.innerHTML =
            data.suggestions[0];

        return;

    }

    summary.innerHTML =
        "No suggestions available.";

}

// ======================================================
// REFRESH
// ======================================================

function refreshDashboard() {

    loadResumeAnalysis();

}
// ======================================================
// AXONIX - index.js
// Part 4
// Animations + App Startup
// ======================================================

// ======================================================
// REVEAL ANIMATION
// ======================================================

function initializeAnimations() {

    const hiddenElements =
        document.querySelectorAll(".hidden");

    if (!hiddenElements.length) return;

    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting)
                        return;

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                });

            },

            {
                threshold: 0.15
            }

        );

    hiddenElements.forEach((element) => {

        observer.observe(element);

    });

}

// ======================================================
// COUNTER ANIMATION
// ======================================================

function initializeCounters() {

    const counters =
        document.querySelectorAll(".counter");

    if (!counters.length) return;

    counters.forEach((counter) => {

        const target =
            Number(counter.dataset.target);

        animateCounter(counter, target);

    });

}

function animateCounter(element, target) {

    let current = 0;

    const increment =
        Math.max(1, Math.ceil(target / 100));

    const timer =
        setInterval(() => {

            current += increment;

            if (current >= target) {

                current = target;

                clearInterval(timer);

            }

            element.textContent =
                formatNumber(current);

        }, 20);

}

// ======================================================
// HERO CARD FLOAT
// ======================================================

function initializeHeroAnimation() {

    const heroCard =
        document.querySelector(".dashboard-preview");

    if (!heroCard) return;

    heroCard.animate(

        [

            {

                transform:
                    "translateY(0px)"

            },

            {

                transform:
                    "translateY(-12px)"

            },

            {

                transform:
                    "translateY(0px)"

            }

        ],

        {

            duration: 3500,

            iterations: Infinity,

            easing: "ease-in-out"

        }

    );

}

// ======================================================
// CARD HOVER
// ======================================================

function initializeCards() {

    const cards =
        document.querySelectorAll(".feature-card");

    cards.forEach((card) => {

        card.addEventListener("mouseenter", () => {

            card.style.transform =
                "translateY(-10px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =
                "";

        });

    });

}

// ======================================================
// WINDOW FOCUS
// ======================================================

window.addEventListener("focus", () => {

    if (isLoggedIn()) {

        loadResumeAnalysis();

    }

});

// ======================================================
// PAGE VISIBILITY
// ======================================================

document.addEventListener("visibilitychange", () => {

    if (
        !document.hidden &&
        isLoggedIn()
    ) {

        loadResumeAnalysis();

    }

});

// ======================================================
// APP INITIALIZER
// ======================================================

function initializeApp() {

    log("Starting AXONIX...");

    initializeNavbar();

    initializeSidebar();

    initializeAnimations();

    initializeCounters();

    initializeCards();

    initializeHeroAnimation();

    loadResumeAnalysis();

}

// ======================================================
// START
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

log("AXONIX Ready 🚀");