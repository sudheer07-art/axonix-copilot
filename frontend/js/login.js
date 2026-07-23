const API_URL = "https://axonix-copilot.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");

    const password = document.getElementById("password");
    const toggle = document.getElementById("togglePassword");

    if (toggle) {

        toggle.addEventListener("click", () => {

            if (password.type === "password") {

                password.type = "text";
                toggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';

            } else {

                password.type = "password";
                toggle.innerHTML = '<i class="fa-solid fa-eye"></i>';

            }

        });

    }

    form.addEventListener("submit", loginUser);

});

async function loginUser(e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("loginMessage");
    const button = document.querySelector(".login-btn");

    button.disabled = true;
    button.innerHTML = "Signing In...";

    message.innerHTML = "";

    try {

        const response = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.detail || "Login failed");

        }

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("email", email);

        if (data.username) {

            localStorage.setItem("username", data.username);

        }

        if (window.parent && window.parent.loginSuccess) {

            window.parent.loginSuccess(
                data.username || "User",
                email
            );

        }

    }

    catch (err) {

        message.style.color = "#ef4444";
        message.innerHTML = err.message;

    }

    finally {

        button.disabled = false;
        button.innerHTML = "<span>Login</span>";

    }

}