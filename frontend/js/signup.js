// ==========================================
// AXONIX SIGNUP
// ==========================================

const API_URL ="https://axonix-copilot.onrender.com";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value
        .trim();

    const message = document.getElementById("signupMessage");

    message.style.color = "red";

    // Password Match Validation

    if (password !== confirmPassword) {

        message.innerHTML = "Passwords do not match.";

        return;

    }

    message.innerHTML = "Creating account...";

    try {

        const response = await fetch(

            `${API_URL}/auth/signup`,

            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username: username,

                    email: email,

                    password: password

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            message.innerHTML =
                data.detail || "Signup failed.";

            return;

        }

        message.style.color = "green";

        message.innerHTML =
            "Account created successfully!";

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);

    }

    catch (error) {

        console.log(error);

        message.innerHTML =
            "Unable to connect to server.";

    }

});