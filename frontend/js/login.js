// ==========================================
// AXONIX LOGIN.JS
// ==========================================

const API_URL = "https://axonix-copilot.onrender.com";

const loginForm = document.getElementById("loginForm");

const message = document.getElementById("loginMessage");


//==========================================
// PASSWORD SHOW / HIDE
//==========================================

const togglePassword =
    document.getElementById("togglePassword");

const passwordInput =
    document.getElementById("password");

if (togglePassword && passwordInput) {

    togglePassword.onclick = () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        }

        else {

            passwordInput.type = "password";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    };

}


//==========================================
// LOGIN
//==========================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();

    message.style.color = "#ef4444";
    message.innerHTML = "Logging in...";

    try {

        const formData = new URLSearchParams();

        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch(

            `${API_URL}/auth/login`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/x-www-form-urlencoded"

                },

                body: formData

            }

        );

        const data = await response.json();

        if (!response.ok) {

            message.innerHTML =
                data.detail || "Invalid Credentials";

            return;

        }

        //--------------------------------
        // SAVE TOKEN
        //--------------------------------

        localStorage.setItem(
            "token",
            data.access_token
        );

        localStorage.setItem(
            "username",
            username
        );

        //--------------------------------
        // SUCCESS
        //--------------------------------

        message.style.color = "#22c55e";

        message.innerHTML =
            "Login Successful ✓";

        //--------------------------------
        // CLOSE POPUP
        //--------------------------------

        setTimeout(() => {

            if (
                window.parent &&
                window.parent.loginSuccess
            ) {

                window.parent.loginSuccess(username);

            }

            setTimeout(() => {

                window.parent.location.reload();

            }, 300);

        }, 900);

    }

    catch (err) {

        console.error(err);

        message.style.color = "#ef4444";

        message.innerHTML =
            "Unable to connect to server.";

    }

});