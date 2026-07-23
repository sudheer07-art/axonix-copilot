const API_URL = "https://axonix-copilot.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signupForm");

    const password = document.getElementById("password");
    const confirm = document.getElementById("confirmPassword");

    const toggle1 = document.getElementById("togglePassword");
    const toggle2 = document.getElementById("toggleConfirmPassword");

    toggle1.onclick = () => {

        password.type =
            password.type === "password"
                ? "text"
                : "password";

        toggle1.innerHTML =
            password.type === "password"
                ? '<i class="fa-solid fa-eye"></i>'
                : '<i class="fa-solid fa-eye-slash"></i>';

    };

    toggle2.onclick = () => {

        confirm.type =
            confirm.type === "password"
                ? "text"
                : "password";

        toggle2.innerHTML =
            confirm.type === "password"
                ? '<i class="fa-solid fa-eye"></i>'
                : '<i class="fa-solid fa-eye-slash"></i>';

    };

    form.addEventListener("submit", signupUser);

});

async function signupUser(e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirm =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("signupMessage");

    const button =
        document.querySelector(".signup-btn");

    message.innerHTML = "";

    if (password !== confirm) {

        message.style.color = "#ef4444";
        message.innerHTML = "Passwords do not match.";

        return;

    }

    button.disabled = true;
    button.innerHTML = "Creating Account...";

    try {

        const response = await fetch(`${API_URL}/auth/register`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                username,
                email,
                password

            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.detail || "Registration failed");

        }

        message.style.color = "#22c55e";
        message.innerHTML = "Account created successfully.";

        setTimeout(() => {

            if (window.parent && window.parent.openLogin) {

                window.parent.openLogin();

            }

        }, 1200);

    }

    catch (err) {

        message.style.color = "#ef4444";
        message.innerHTML = err.message;

    }

    finally {

        button.disabled = false;
        button.innerHTML = "<span>Create Account</span>";

    }

}