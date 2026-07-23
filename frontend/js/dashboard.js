/* ==========================================================
   AXONIX Dashboard
========================================================== */

const API_BASE = "https://axonix-copilot.onrender.com";

const token = localStorage.getItem("access_token");

if (!token) {

    window.location.href = "index.html";

}

/* ==========================================================
   SIDEBAR
========================================================== */

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const overlay = document.getElementById("sidebarOverlay");

function openSidebar() {

    sidebar.classList.add("active");

    overlay.classList.add("show");

}

function hideSidebar() {

    sidebar.classList.remove("active");

    overlay.classList.remove("show");

}

menuToggle.addEventListener("click", openSidebar);

closeSidebar.addEventListener("click", hideSidebar);

overlay.addEventListener("click", hideSidebar);

/* ==========================================================
   LOADING
========================================================== */

const loadingPopup = document.getElementById("loadingPopup");
const loadingMessage = document.getElementById("loadingMessage");

function showLoading(text = "Loading...") {

    loadingMessage.textContent = text;

    loadingPopup.classList.add("show");

}

function hideLoading() {

    loadingPopup.classList.remove("show");

}

/* ==========================================================
   FETCH
========================================================== */

async function api(url, options = {}) {

    const response = await fetch(

        API_BASE + url,

        {

            ...options,

            headers:{

                Authorization:`Bearer ${token}`,

                ...(options.headers || {})

            }

        }

    );

    if(response.status===401){

        localStorage.removeItem("access_token");

        location.href="index.html";

        return null;

    }

    return response;

}

/* ==========================================================
   USER
========================================================== */

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const topUserName = document.getElementById("topUserName");

const welcomeName = document.getElementById("welcomeName");

const userAvatar = document.getElementById("userAvatar");

const topAvatar = document.getElementById("topAvatar");

async function loadUser(){

    const res = await api("/auth/me");

    if(!res) return;

    const user = await res.json();

    const name = user.username || user.name || "User";

    const email = user.email || "";

    userName.textContent = name;

    userEmail.textContent = email;

    topUserName.textContent = name;

    welcomeName.textContent = name;

    const avatar =

    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;

    userAvatar.src = avatar;

    topAvatar.src = avatar;

}

/* ==========================================================
   LOGOUT
========================================================== */

document

.getElementById("logoutBtn")

.addEventListener("click",e=>{

    e.preventDefault();

    localStorage.clear();

    location.href="index.html";

});
/* ==========================================================
   DASHBOARD DATA
========================================================== */

const resumeName = document.getElementById("resumeName");
const resumeProgress = document.getElementById("resumeProgress");

const atsScore = document.getElementById("atsScore");
const skillsCount = document.getElementById("skillsCount");
const jobMatches = document.getElementById("jobMatches");

const suggestions = document.getElementById("suggestions");
const recommendedJobs = document.getElementById("recommendedJobs");

/* ==========================================================
   LOCAL DATA
========================================================== */

function getData(){

    return{

        ats:Number(
            localStorage.getItem("ats_score")
        ) || 0,

        skills:JSON.parse(
            localStorage.getItem("skills") || "[]"
        ),

        jobs:JSON.parse(
            localStorage.getItem("job_matches") || "[]"
        ),

        suggestions:JSON.parse(
            localStorage.getItem("suggestions") || "[]"
        ),

        resume:JSON.parse(
            localStorage.getItem("resume_data") || "{}"
        )

    };

}

/* ==========================================================
   RESUME CARD
========================================================== */

function renderResume(){

    const data = getData();

    resumeName.textContent =
        data.resume.file_name ||
        data.resume.filename ||
        "No Resume Uploaded";

    atsScore.textContent =
        data.ats + "%";

    skillsCount.textContent =
        data.skills.length;

    jobMatches.textContent =
        data.jobs.length;

    resumeProgress.style.width =
        data.ats + "%";

}

/* ==========================================================
   AI SUGGESTIONS
========================================================== */

function renderSuggestions(){

    const data = getData();

    suggestions.innerHTML = "";

    if(data.suggestions.length===0){

        suggestions.innerHTML = `

        <div class="suggestion-card">

            <i class="fa-solid fa-circle-info"></i>

            <div>

                <h3>No Suggestions</h3>

                <p>

                    Analyze your resume to
                    receive AI suggestions.

                </p>

            </div>

        </div>

        `;

        return;

    }

    data.suggestions.forEach(item=>{

        suggestions.innerHTML += `

        <div class="suggestion-card">

            <i class="fa-solid fa-check"></i>

            <div>

                <h3>Suggestion</h3>

                <p>${item}</p>

            </div>

        </div>

        `;

    });

}

/* ==========================================================
   JOBS
========================================================== */

function renderJobs(){

    const data = getData();

    recommendedJobs.innerHTML = "";

    if(data.jobs.length===0){

        recommendedJobs.innerHTML = `

        <div class="job-card">

            <div class="job-info">

                <div class="company-icon">

                    <i class="fa-solid fa-building"></i>

                </div>

                <div>

                    <h3>No Jobs Found</h3>

                    <p>

                        Analyze your resume
                        to get job recommendations.

                    </p>

                </div>

            </div>

        </div>

        `;

        return;

    }

    data.jobs.forEach(job=>{

        recommendedJobs.innerHTML += `

        <div class="job-card">

            <div class="job-info">

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

            <div class="job-action">

                <span class="match">

                    ${job.score || 90}% Match

                </span>

                <button
                    class="apply-btn"
                    onclick="window.open('${job.url || "#"}','_blank')">

                    Apply

                </button>

            </div>

        </div>

        `;

    });

}

/* ==========================================================
   BUTTONS
========================================================== */

document
.getElementById("openAnalyzePage")
.addEventListener("click",()=>{

    location.href="analyze.html";

});

/* ==========================================================
   START
========================================================== */

async function init(){

    showLoading("");

    await loadUser();

    renderResume();

    renderSuggestions();

    renderJobs();

    hideLoading();

}

document.addEventListener(

    "DOMContentLoaded",

    init

);