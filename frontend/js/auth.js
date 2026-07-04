const API = "https://axonix-copilot.onrender.com";

async function login(){

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    try{

        const response = await fetch(
            API + "/auth/login",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                body:formData
            }
        );

        const data = await response.json();

        if(!response.ok){

            document.getElementById("error").innerHTML =
                data.detail;

            return;
        }

        localStorage.setItem(
            "token",
            data.access_token
        );

        window.location.href =
            "dashboard.html";

    }

    catch(error){

        document.getElementById("error").innerHTML =
            "Unable to connect to server.";

    }

}