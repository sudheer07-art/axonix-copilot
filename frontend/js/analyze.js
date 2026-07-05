const API_URL = "https://axonix-copilot.onrender.com";

const token = localStorage.getItem("token");

if (!token) {

    alert("Please login first.");

    window.location.href = "index.html";

}

const analyzeBtn = document.getElementById("analyzeBtn");
const resumeInput = document.getElementById("resumeFile");
const loading = document.getElementById("loading");
const status = document.getElementById("analysisStatus");
const results = document.getElementById("results");

analyzeBtn.addEventListener("click", analyzeResume);

function showLoading(){

    loading.style.display = "block";

}

function hideLoading(){

    loading.style.display = "none";

}

async function analyzeResume(){

    const file = resumeInput.files[0];

    if(!file){

        alert("Please choose a PDF Resume.");

        return;

    }

    showLoading();

    status.innerHTML = "🤖 Uploading Resume...";

    analyzeBtn.disabled = true;

    analyzeBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';

    const formData = new FormData();

    formData.append("file", file);

    try{

        const response = await fetch(

            API_URL + "/analyze-resume",

            {

                method:"POST",

                headers:{

                    Authorization:`Bearer ${token}`

                },

                body:formData

            }

        );

        const data = await response.json();

        console.log("Analyze Resume Response:", data);

        if(!response.ok){

            throw new Error(

                data.detail ||

                "Resume analysis failed."

            );

        }

        const analysis = data.analysis;
        console.log("STEP 1");
        const analysisId = data.analysis_id;
        console.log("Analysis ID:", analysisId);

        status.innerHTML = "✅ Analysis Completed Successfully";
        // Generate Job Matches
const jobResponse = await fetch(

    API_URL + "/generate-job-matches/" + analysisId,

    {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

);


console.log("Job Match Status:", jobResponse.status);

const jobData = await jobResponse.json();
console.log(jobData);

console.log("Job Match Response:", jobData);

if (!jobResponse.ok) {
    throw new Error(jobData.detail || "Job matching failed.");
}

console.log("Job matching completed.");

        localStorage.setItem(

            "latest_resume_analysis",

            JSON.stringify(analysis)

        );

        results.innerHTML = `

        <div class="result-card ats-box">

            <h2>ATS SCORE</h2>

            <div class="ats-number">

                ${analysis.ats_score}%

            </div>

            <div class="ats-text">

                AI Resume Score

            </div>

        </div>

        <div class="result-card">

            <h2>

                Skills Detected

            </h2>

            <p>

                ${analysis.skills.join(", ")}

            </p>

        </div>

        <div class="result-card">

            <h2>

                AI Summary

            </h2>

            <p>

                ${analysis.summary}

            </p>

        </div>

        `;

        // setTimeout(()=>{

        //     // window.location.href="dashboard.html";

        // },1800);

    }

    catch(error){

        console.error(error);

        status.innerHTML="❌ "+error.message;

    }

    finally{

        hideLoading();

        analyzeBtn.disabled=false;

        analyzeBtn.innerHTML=

        '<i class="fa-solid fa-wand-magic-sparkles"></i> Analyze Resume';

    }

}
const backBtn = document.getElementById("backBtn");

if(backBtn){

    backBtn.addEventListener("click", () => {

        window.history.back();

    });

}