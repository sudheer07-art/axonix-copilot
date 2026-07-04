/*==================================================
                AXONIX DASHBOARD
==================================================*/

const API_URL = "http://127.0.0.1:8000";

/*==================================================
                AUTH
==================================================*/

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "index.html";

}

/*==================================================
                USER
==================================================*/

const username =
    localStorage.getItem("username") || "User";

const email =
    localStorage.getItem("email") || "user@axonix.ai";

/*==================================================
                DOM
==================================================*/

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("sidebarOverlay");

const menuBtn =
    document.getElementById("menuToggle");

const closeBtn =
    document.getElementById("closeSidebar");

const logoutBtn =
    document.getElementById("logoutBtn");

const welcomeName =
    document.getElementById("welcomeName");

const userName =
    document.getElementById("userName");

const userEmail =
    document.getElementById("userEmail");

const userAvatar =
    document.getElementById("userAvatar");

/*==================================================
                CHARTS
==================================================*/

let atsChart = null;

let skillsChart = null;

/*==================================================
            LOAD USER INSTANTLY
==================================================*/

function loadUser(){

    if(welcomeName){

        welcomeName.innerHTML =
            username;

    }

    if(userName){

        userName.innerHTML =
            username;

    }

    if(userEmail){

        userEmail.innerHTML =
            email;

    }

    if(userAvatar){

        userAvatar.src =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=2563eb&color=fff`;

    }

}

/*==================================================
            SIDEBAR
==================================================*/

function openSidebar(){

    if(!sidebar) return;

    sidebar.classList.add("show");

    if(overlay){

        overlay.classList.add("show");

    }

}

function closeSidebar(){

    if(!sidebar) return;

    sidebar.classList.remove("show");

    if(overlay){

        overlay.classList.remove("show");

    }

}

/*==================================================
        SIDEBAR EVENTS
==================================================*/

if(menuBtn){

    menuBtn.onclick = openSidebar;

}

if(closeBtn){

    closeBtn.onclick = closeSidebar;

}

if(overlay){

    overlay.onclick = closeSidebar;

}

/*==================================================
            LOGOUT
==================================================*/

if(logoutBtn){

    logoutBtn.onclick = function(){

        localStorage.clear();

        window.location.href =
            "index.html";

    }

}

/*==================================================
        FAST PLACEHOLDERS
==================================================*/

function showLoadingData(){

    const ids = [

        "atsScore",

        "skillsCount",

        "jobMatches",

        "profileStrength"

    ];

    ids.forEach(id=>{

        const element =
            document.getElementById(id);

        if(element){

            element.innerHTML="...";

        }

    });

}

/*==================================================
        DASHBOARD CACHE
==================================================*/

let dashboardLoaded = false;

let dashboardData = null;

/*==================================================
        START DASHBOARD
==================================================*/

async function initializeDashboard(){

    loadUser();

    showLoadingData();
    showPopup(
    "Please wait while AXONIX updates your dashboard..."
);


    requestAnimationFrame(()=>{

        fetchDashboard();

    });

}

document.addEventListener(

    "DOMContentLoaded",

    initializeDashboard

);
/*==================================================
            FETCH DASHBOARD
==================================================*/

async function fetchDashboard(){

    if(dashboardLoaded){

        return;

    }

    dashboardLoaded = true;
    showPopup(
    "Please wait while AXONIX updates your dashboard..."
);

await new Promise(resolve => setTimeout(resolve,100));

    try{

        const response = await fetch(

            API_URL + "/dashboard/",

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );
      

        if(!response.ok){

            throw new Error("Unable to load dashboard");

        }

        dashboardData = await response.json();
        
        updateDashboard();


    }

    catch(error){

        console.error(error);
        hidePopup();
        

    }

}

/*==================================================
            UPDATE DASHBOARD
==================================================*/

function updateDashboard(){

    if(!dashboardData){

        return;

    }

    /*==========================
        USER
    ==========================*/

    if(dashboardData.username){

        userName.textContent =
            dashboardData.username;

        welcomeName.textContent =
            dashboardData.username;

    }

    if(dashboardData.email){

        userEmail.textContent =
            dashboardData.email;

    }

    /*==========================
        ATS
    ==========================*/

    const atsScore =
        document.getElementById("atsScore");

    if(atsScore){

        atsScore.textContent =
            Math.round(
                dashboardData.ats_score || 0
            ) + "%";

    }

    /*==========================
        SKILLS
    ==========================*/

    const skillsCount =
        document.getElementById("skillsCount");

    if(skillsCount){

        skillsCount.textContent =
            dashboardData.skills
            ? dashboardData.skills.length
            : 0;

    }

    /*==========================
        JOBS
    ==========================*/

    const jobMatches =
        document.getElementById("jobMatches");

    if(jobMatches){

        jobMatches.textContent =
            dashboardData.job_matches || 0;

    }

    /*==========================
        PROFILE
    ==========================*/

    const profileStrength =
        document.getElementById("profileStrength");

    if(profileStrength){

        profileStrength.textContent =
            Math.round(
                dashboardData.profile_strength || 0
            ) + "%";

    }

    /*==========================
        RESUME
    ==========================*/

    const resumeName =
        document.getElementById("resumeName");

    if(resumeName){

        resumeName.textContent =
            dashboardData.resume_name
            || "Latest Resume";

    }

    const resumeProgress =
        document.getElementById("resumeProgress");

    if(resumeProgress){

        resumeProgress.style.width =
            (dashboardData.ats_score || 0) + "%";

    }

    const resumeHealth =
        document.getElementById("resumeHealth");

    if(resumeHealth){

        resumeHealth.textContent =
            "Resume Health " +
            (dashboardData.resume_health || 0)
            + "%";

    }

    /*==========================
        LOAD REMAINING DATA
    ==========================*/

    drawATSChart();

    drawSkillsChart();

    loadSuggestions();

    loadJobs();

    loadRecentActivity();

    loadAchievements();

    loadInsights();

    loadGoals();
   setTimeout(() => {

    hidePopup();

},500);

}

/*==================================================
                ATS CHART
==================================================*/

function drawATSChart(){

    const canvas =
        document.getElementById("atsChart");

    if(!canvas) return;

    const score =
        dashboardData.ats_score || 0;

    if(!atsChart){

        atsChart = new Chart(canvas,{

            type:"doughnut",

            data:{

                labels:[

                    "ATS Score",

                    "Remaining"

                ],

                datasets:[{

                    data:[

                        score,

                        100-score

                    ],

                    backgroundColor:[

                        "#2563eb",

                        "#1e293b"

                    ],

                    borderWidth:0

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                cutout:"75%",

                animation:{
                    duration:900
                },

                plugins:{
                    legend:{
                        display:false
                    }
                }

            }

        });

    }

    else{

        atsChart.data.datasets[0].data=[

            score,

            100-score

        ];

        atsChart.update();

    }

}

/*==================================================
                SKILLS CHART
==================================================*/

function drawSkillsChart(){

    const canvas =
        document.getElementById("skillsChart");

    if(!canvas) return;

    const skills =
        dashboardData.skills || [];

    if(!skillsChart){

        skillsChart = new Chart(canvas,{

            type:"bar",

            data:{

                labels:skills,

                datasets:[{

                    label:"Skills",

                    data:skills.map(()=>100),

                    backgroundColor:"#3b82f6",

                    borderRadius:8,

                    borderSkipped:false

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                animation:{
                    duration:900
                },

                plugins:{
                    legend:{
                        display:false
                    }
                },

                scales:{

                    y:{

                        display:false,

                        max:100

                    },

                    x:{

                        grid:{
                            display:false
                        },

                        ticks:{
                            color:"#ffffff"
                        }

                    }

                }

            }

        });

    }

    else{

        skillsChart.data.labels =
            skills;

        skillsChart.data.datasets[0].data =
            skills.map(()=>100);

        skillsChart.update();

    }

}

/*==================================================
            CHART REFRESH
==================================================*/

function refreshCharts(){

    if(atsChart){

        atsChart.update("none");

    }

    if(skillsChart){

        skillsChart.update("none");

    }

}
/*==================================================
            AI SUGGESTIONS
==================================================*/

function loadSuggestions(){

    const container =
        document.getElementById("suggestions");

    if(!container) return;

    const suggestions =
        dashboardData.suggestions || [];

    if(suggestions.length===0){

        container.innerHTML=`
        <div class="suggestion-card">

            <i class="fa-solid fa-circle-info"></i>

            <span>No AI Suggestions Available.</span>

        </div>`;

        return;

    }

    let html="";

    suggestions.forEach(item=>{

        html+=`

        <div class="suggestion-card">

            <i class="fa-solid fa-circle-check"></i>

            <span>${item}</span>

        </div>

        `;

    });

    container.innerHTML=html;

}

/*==================================================
            RECOMMENDED JOBS
==================================================*/

function loadJobs(){

    const container =
        document.getElementById("recommendedJobs");

    if(!container) return;

    const jobs =
        dashboardData.jobs || [];

    if(jobs.length===0){

        container.innerHTML=`
        <div class="job-card">

            <div class="job-left">

                <h3>No Jobs Found</h3>

                <p>

                    Upload a resume to receive
                    AI Job Recommendations.

                </p>

            </div>

        </div>`;

        return;

    }

    let html="";

    jobs.forEach(job=>{

        html+=`

        <div class="job-card">

            <div class="job-left">

                <h3>${job.title}</h3>

                <p>${job.company}</p>

                <small>${job.location}</small>

            </div>

            <div class="job-right">

                <span class="match-score">

                    ${job.match_score}% Match

                </span>

                <a href="${job.apply_link}"
                   target="_blank">

                    <button class="apply-btn">

                        Apply

                    </button>

                </a>

            </div>

        </div>

        `;

    });

    container.innerHTML=html;

}

/*==================================================
            RECENT ACTIVITY
==================================================*/

function loadRecentActivity(){

    const container =
        document.getElementById("recentActivity");

    if(!container) return;

    const activity =
        dashboardData.activity || [];

    if(activity.length===0){

        container.innerHTML=`
        <div class="activity-item">

            <i class="fa-solid fa-clock"></i>

            <div>

                <h4>No Activity</h4>

                <p>

                    Your latest dashboard
                    activity appears here.

                </p>

            </div>

        </div>`;

        return;

    }

    let html="";

    activity.forEach(item=>{

        html+=`

        <div class="activity-item">

            <i class="fa-solid fa-check-circle"></i>

            <div>

                <h4>${item.title}</h4>

                <p>${item.time}</p>

            </div>

        </div>

        `;

    });

    container.innerHTML=html;

}

/*==================================================
        PROFILE COMPLETION
==================================================*/

function loadProfileCompletion(){

    const progress =
        document.getElementById("profileCompletion");

    const text =
        document.getElementById("profileCompletionText");

    if(progress){

        progress.style.width =
            (dashboardData.profile_strength||0)
            + "%";

    }

    if(text){

        text.textContent =
            (dashboardData.profile_strength||0)
            + "% Completed";

    }

}
/*==================================================
        ACHIEVEMENTS
==================================================*/

function loadAchievements(){

    const container =
        document.getElementById("achievements");

    if(!container) return;

    const achievements =
        dashboardData.achievements || [];

    if(achievements.length===0){

        container.innerHTML=`
        <div class="achievement-card">

            <i class="fa-solid fa-medal"></i>

            <h3>Start Your Journey</h3>

            <p>

                Upload your resume to unlock
                achievements.

            </p>

        </div>`;

        return;

    }

    let html="";

    achievements.forEach(item=>{

        html+=`

        <div class="achievement-card">

            <i class="fa-solid fa-trophy"></i>

            <h3>${item}</h3>

        </div>

        `;

    });

    container.innerHTML=html;

}

/*==================================================
        CAREER INSIGHTS
==================================================*/

function loadInsights(){

    const container =
        document.getElementById("careerInsights");

    if(!container) return;

    const insights =
        dashboardData.insights || [];

    if(insights.length===0){

        container.innerHTML=`
        <div class="insight-card">

            <i class="fa-solid fa-lightbulb"></i>

            <p>

                Analyze your resume to receive
                AI Career Insights.

            </p>

        </div>`;

        return;

    }

    let html="";

    insights.forEach(item=>{

        html+=`

        <div class="insight-card">

            <i class="fa-solid fa-lightbulb"></i>

            <p>${item}</p>

        </div>

        `;

    });

    container.innerHTML=html;

}

/*==================================================
        WEEKLY GOALS
==================================================*/

function loadGoals(){

    const container =
        document.getElementById("weeklyGoals");

    if(!container) return;

    const goals =
        dashboardData.goals || [];

    if(goals.length===0){

        container.innerHTML=`
        <div class="goal-item">

            <input type="checkbox">

            <span>

                No Goals Available

            </span>

        </div>`;

        return;

    }

    let html="";

    goals.forEach(goal=>{

        html+=`

        <div class="goal-item">

            <input type="checkbox">

            <span>${goal}</span>

        </div>

        `;

    });

    container.innerHTML=html;

}

/*==================================================
        REFRESH DASHBOARD
==================================================*/

async function refreshDashboard(){

    dashboardLoaded = false;

    await fetchDashboard();

}

/*==================================================
        AUTO REFRESH
==================================================*/

// Refresh every 5 minutes

setInterval(refreshDashboard,300000);

/*==================================================
        BUTTONS
==================================================*/

const analyzeBtn =
document.getElementById("openAnalyzePage");

if(analyzeBtn){

    analyzeBtn.onclick=()=>{

        window.location.href="analyze.html";

    }

}

/*==================================================
        PAGE ANIMATION
==================================================*/

window.addEventListener("load",()=>{

    document.body.classList.add("fade-in");

});

/*==================================================
        KEYBOARD SHORTCUTS
==================================================*/

document.addEventListener("keydown",e=>{

    if(e.key==="Escape"){

        closeSidebar();

    }

});

/*==================================================
        START DASHBOARD
==================================================*/

// document.addEventListener(

//     "DOMContentLoaded",

//     ()=>{

//         initializeDashboard();

//     }

// );

console.log("AXONIX Dashboard Ready 🚀");
function showPopup(message){

    const popup = document.getElementById("loadingPopup");

    if(!popup) return;

    document.getElementById("loadingMessage").textContent = message;

    popup.style.display = "block";

    popup.style.opacity = "1";

    popup.style.transform = "translateY(0)";

}

function hidePopup(){

    const popup = document.getElementById("loadingPopup");

    if(!popup) return;

    popup.style.opacity = "0";

    popup.style.transform = "translateY(-15px)";

    setTimeout(()=>{

        popup.style.display = "none";

        popup.style.opacity = "1";

        popup.style.transform = "translateY(0)";

    },300);

}