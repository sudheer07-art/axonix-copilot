console.log("index.js loaded");
function showPopup(message){

    const popup = document.getElementById("loadingPopup");

    if(!popup) return;

    document.getElementById("loadingMessage").textContent = message;

    popup.classList.add("show");

}

function hidePopup(){

    const popup = document.getElementById("loadingPopup");

    if(!popup) return;

    popup.classList.remove("show");

}

async function loadResumeAnalysis() {

    console.log("Function Started");

    const token = localStorage.getItem("token");

    console.log("Token:", token);

    if (!token) {
        console.log("No token found");
        return;
    }
   
    try {
         showPopup(
        "Please wait while AXONIX AI updates your dashboard..."
    );

        console.log("Sending request...");

        const response = await fetch(
            "https://axonix-copilot.onrender.com/dashboard/",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        showPopup(
    "Please wait while AXONIX AI updates your dashboard..."
);
        console.log("Fetch completed");

        console.log("Response Status:", response.status);

        if (!response.ok) {
            throw new Error("Failed to load dashboard");
        }

        const data = await response.json();
        console.log("JSON parsed");

        console.log("Dashboard Data:", data);

        // ATS Score
        const ats = document.getElementById("atsScore");
        if (ats) {
            ats.innerHTML = `${Math.round(data.ats_score)}%`;
        }

        // Skills Count
        const skills = document.getElementById("skillsCount");
        if (skills) {
            skills.innerHTML = data.skills.length;
        }

        // Job Matches
        const jobs = document.getElementById("jobCount");
        if (jobs) {
            jobs.innerHTML = data.job_matches;
        }

        // AI Summary
        const summary = document.getElementById("summary");
        if (summary) {

            if (data.summary && data.summary.trim() !== "") {
                summary.innerHTML = data.summary;
            }
            else if (data.suggestions.length > 0) {
                summary.innerHTML = data.suggestions[0];
            }
            else {
                summary.innerHTML = "No suggestions available.";
            }

        }

        console.log("Dashboard Updated Successfully");
        hidePopup();
       



    }
   catch (error) {
    console.error("FULL ERROR:", error);
        hidePopup();
}

}

window.addEventListener("load", loadResumeAnalysis);