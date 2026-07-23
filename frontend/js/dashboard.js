/* ==========================================================
   AXONIX AI Career Dashboard
   dashboard.js
   Part 1A
========================================================== */

const API_BASE = "https://axonix-copilot.onrender.com";

const token = localStorage.getItem("access_token");

/* ==========================================================
   DOM
========================================================== */

const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const loadingPopup = document.getElementById("loadingPopup");
const loadingMessage = document.getElementById("loadingMessage");

const logoutBtn = document.getElementById("logoutBtn");

/* ---------- User ---------- */

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const welcomeName = document.getElementById("welcomeName");

const topUserName = document.getElementById("topUserName");

const userAvatar = document.getElementById("userAvatar");
const topAvatar = document.getElementById("topAvatar");

/* ---------- Resume ---------- */

const resumeName = document.getElementById("resumeName");
const resumeProgress = document.getElementById("resumeProgress");
const resumeHealth = document.getElementById("resumeHealth");

/* ---------- Stats ---------- */

const atsScore = document.getElementById("atsScore");
const skillsCount = document.getElementById("skillsCount");
const jobMatches = document.getElementById("jobMatches");
const profileStrength = document.getElementById("profileStrength");

/* ---------- Containers ---------- */

const suggestionsContainer =
    document.getElementById("suggestions");

const recommendedJobs =
    document.getElementById("recommendedJobs");

/* ==========================================================
   LOADING POPUP
========================================================== */

function showLoading(message = "Loading...") {

    if (!loadingPopup) return;

    loadingMessage.textContent = message;

    loadingPopup.classList.add("show");

}

function hideLoading() {

    if (!loadingPopup) return;

    loadingPopup.classList.remove("show");

}

/* ==========================================================
   SIDEBAR
========================================================== */

function openSidebar() {

    sidebar.classList.add("active");

    sidebarOverlay.classList.add("show");

}

function closeMenu() {

    sidebar.classList.remove("active");

    sidebarOverlay.classList.remove("show");

}

if (menuToggle) {

    menuToggle.addEventListener("click", openSidebar);

}

if (closeSidebar) {

    closeSidebar.addEventListener("click", closeMenu);

}

if (sidebarOverlay) {

    sidebarOverlay.addEventListener("click", closeMenu);

}

/* ==========================================================
   AUTH
========================================================== */

if (!token) {

    window.location.href = "index.html";

}

/* ==========================================================
   FETCH WRAPPER
========================================================== */

async function api(url, options = {}) {

    const response = await fetch(
        `${API_BASE}${url}`,
        {
            ...options,

            headers: {
                Authorization: `Bearer ${token}`,
                ...(options.headers || {})
            }
        }
    );

    if (response.status === 401) {

        localStorage.removeItem("access_token");

        window.location.href = "index.html";

        return;

    }

    return response;

}

/* ==========================================================
   COUNTER ANIMATION
========================================================== */

function animateNumber(element, endValue, suffix = "") {

    if (!element) return;

    let start = 0;

    const duration = 800;

    const increment = endValue / (duration / 16);

    const timer = setInterval(() => {

        start += increment;

        if (start >= endValue) {

            start = endValue;

            clearInterval(timer);

        }

        element.textContent =
            Math.floor(start) + suffix;

    }, 16);

}

/* ==========================================================
   AVATAR
========================================================== */

function updateAvatar(name) {

    if (!name) return;

    const avatarURL =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;

    if (userAvatar)
        userAvatar.src = avatarURL;

    if (topAvatar)
        topAvatar.src = avatarURL;

}

/* ==========================================================
   PAGE START
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    showLoading("Preparing your dashboard...");

});
/* ==========================================================
   LOAD CURRENT USER
========================================================== */

async function loadCurrentUser() {

    try {

        showLoading("Loading your profile...");

        const response = await api("/auth/me");

        if (!response) return;

        const user = await response.json();

        const username =
            user.username ||
            user.name ||
            "User";

        const email =
            user.email ||
            "No Email";

        /* ---------- Sidebar ---------- */

        if (userName)
            userName.textContent = username;

        if (userEmail)
            userEmail.textContent = email;

        /* ---------- Topbar ---------- */

        if (topUserName)
            topUserName.textContent = username;

        /* ---------- Welcome ---------- */

        if (welcomeName)
            welcomeName.textContent = username;

        /* ---------- Avatar ---------- */

        updateAvatar(username);

        console.log("✅ User Loaded");

    }

    catch (error) {

        console.error("User Load Error:", error);

    }

}

/* ==========================================================
   LOGOUT
========================================================== */

function logout() {

    localStorage.removeItem("access_token");

    localStorage.removeItem("resume_data");

    localStorage.removeItem("resume_analysis");

    localStorage.removeItem("ats_score");

    localStorage.removeItem("job_matches");

    window.location.href = "index.html";

}

if (logoutBtn) {

    logoutBtn.addEventListener("click", e => {

        e.preventDefault();

        logout();

    });

}

/* ==========================================================
   LOAD LOCAL DASHBOARD DATA
========================================================== */

function getDashboardData() {

    return {

        ats:
            Number(localStorage.getItem("ats_score")) || 0,

        skills:
            JSON.parse(
                localStorage.getItem("skills") || "[]"
            ),

        suggestions:
            JSON.parse(
                localStorage.getItem("suggestions") || "[]"
            ),

        jobs:
            JSON.parse(
                localStorage.getItem("job_matches") || "[]"
            ),

        resume:
            JSON.parse(
                localStorage.getItem("resume_data") || "{}"
            )

    };

}

/* ==========================================================
   INITIALIZE
========================================================== */

async function initializeDashboard() {

    await loadCurrentUser();

    hideLoading();

}

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});
/* ==========================================================
   RENDER DASHBOARD DATA
========================================================== */

function renderDashboard() {

    const data = getDashboardData();

    /* ---------- Resume ---------- */

    if (resumeName) {

        resumeName.textContent =
            data.resume.file_name ||
            data.resume.filename ||
            "No Resume Uploaded";

    }

    /* ---------- ATS ---------- */

    animateNumber(atsScore, data.ats, "%");

    animateNumber(profileStrength, data.ats, "%");

    /* ---------- Progress ---------- */

    if (resumeProgress) {

        resumeProgress.style.width =
            `${data.ats}%`;

    }

    if (resumeHealth) {

        resumeHealth.textContent =
            `Resume Health ${data.ats}%`;

    }

    /* ---------- Skills ---------- */

    animateNumber(
        skillsCount,
        data.skills.length
    );

    /* ---------- Jobs ---------- */

    animateNumber(
        jobMatches,
        data.jobs.length
    );

}

/* ==========================================================
   AI SUGGESTIONS
========================================================== */

function renderSuggestions() {

    const data = getDashboardData();

    if (!suggestionsContainer) return;

    suggestionsContainer.innerHTML = "";

    if (data.suggestions.length === 0) {

        suggestionsContainer.innerHTML = `

        <div class="suggestion-card">

            <i class="fa-solid fa-circle-info"></i>

            <div>

                <h4>

                    No Suggestions

                </h4>

                <p>

                    Analyze your resume to receive
                    AI powered suggestions.

                </p>

            </div>

        </div>

        `;

        return;

    }

    data.suggestions.forEach(item => {

        const card = document.createElement("div");

        card.className = "suggestion-card";

        card.innerHTML = `

        <i class="fa-solid fa-check"></i>

        <div>

            <h4>

                AI Recommendation

            </h4>

            <p>

                ${item}

            </p>

        </div>

        `;

        suggestionsContainer.appendChild(card);

    });

}

/* ==========================================================
   RECOMMENDED JOBS
========================================================== */

function renderJobs() {

    const data = getDashboardData();

    if (!recommendedJobs) return;

    recommendedJobs.innerHTML = "";

    if (data.jobs.length === 0) {

        recommendedJobs.innerHTML = `

        <div class="job-card">

            <div class="job-left">

                <div class="company-icon">

                    <i class="fa-solid fa-briefcase"></i>

                </div>

                <div>

                    <h3>

                        No Jobs Found

                    </h3>

                    <p>

                        Analyze your resume to
                        unlock job recommendations.

                    </p>

                </div>

            </div>

            <div class="job-right">

                <span class="match-score">

                    0% Match

                </span>

            </div>

        </div>

        `;

        return;

    }

    data.jobs.slice(0,5).forEach(job => {

        const card = document.createElement("div");

        card.className = "job-card";

        card.innerHTML = `

        <div class="job-left">

            <div class="company-icon">

                <i class="fa-solid fa-building"></i>

            </div>

            <div>

                <h3>

                    ${job.title || "Software Engineer"}

                </h3>

                <p>

                    ${job.company || "Company"}

                </p>

            </div>

        </div>

        <div class="job-right">

            <span class="match-score">

                ${job.score || 90}% Match

            </span>

        </div>

        `;

        recommendedJobs.appendChild(card);

    });

}
/* ==========================================================
   LOAD DASHBOARD FROM BACKEND
========================================================== */

async function loadDashboardData() {

    try {

        showLoading("Loading dashboard...");

        const response = await api("/dashboard");

        if (response && response.ok) {

            const dashboard = await response.json();

            if (dashboard.ats_score !== undefined) {

                localStorage.setItem(
                    "ats_score",
                    dashboard.ats_score
                );

            }

            if (dashboard.skills) {

                localStorage.setItem(
                    "skills",
                    JSON.stringify(dashboard.skills)
                );

            }

            if (dashboard.suggestions) {

                localStorage.setItem(
                    "suggestions",
                    JSON.stringify(dashboard.suggestions)
                );

            }

            if (dashboard.jobs) {

                localStorage.setItem(
                    "job_matches",
                    JSON.stringify(dashboard.jobs)
                );

            }

            if (dashboard.resume) {

                localStorage.setItem(
                    "resume_data",
                    JSON.stringify(dashboard.resume)
                );

            }

        }

    }

    catch (error) {

        console.log("Dashboard API not available.");

    }

}

/* ==========================================================
   PAGE ANIMATION
========================================================== */

function animateCards() {

    const cards = document.querySelectorAll(

        ".card,.stat-card,.action-card,.mini-card"

    );

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(25px)";

        setTimeout(() => {

            card.style.transition =

                ".5s ease";

            card.style.opacity = "1";

            card.style.transform =

                "translateY(0)";

        }, index * 120);

    });

}

/* ==========================================================
   AUTO REFRESH
========================================================== */

window.addEventListener(

    "focus",

    () => {

        renderDashboard();

        renderSuggestions();

        renderJobs();

    }

);

/* ==========================================================
   INITIALIZE
========================================================== */

async function initializeDashboard() {

    try {

        await loadCurrentUser();

        await loadDashboardData();

        renderDashboard();

        renderSuggestions();

        renderJobs();

        animateCards();

    }

    catch (error) {

        console.error(error);

    }

    finally {

        hideLoading();

    }

}

document.addEventListener(

    "DOMContentLoaded",

    initializeDashboard

);

/* ==========================================================
   ANALYZE BUTTON
========================================================== */

const analyzeBtn =

document.getElementById(

"openAnalyzePage"

);

if(analyzeBtn){

analyzeBtn.addEventListener(

"click",

()=>{

showLoading(

"Opening Resume Analyzer..."

);

setTimeout(()=>{

window.location.href=

"analyze.html";

},500);

}

);

}

/* ==========================================================
   LIVE JOB BUTTONS
========================================================== */

document

.querySelectorAll(

'.secondary-btn'

)

.forEach(btn=>{

btn.addEventListener(

'click',

()=>{

showLoading(

'Loading Jobs...'

);

});

});

/* ==========================================================
   FLOATING AI BUTTON
========================================================== */

const aiButton =

document.querySelector(

'.floating-ai'

);

if(aiButton){

aiButton.addEventListener(

'click',

()=>{

alert(

"🤖 AXONIX AI Assistant\n\nComing Soon!"

);

});

}

/* ==========================================================
   END
========================================================== */

console.log(

"🚀 AXONIX Dashboard Loaded Successfully"

);