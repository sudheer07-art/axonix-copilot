// ==========================================
// AXONIX SIGNUP.JS
// ==========================================

const API_URL = "https://axonix-copilot.onrender.com";

const signupForm = document.getElementById("signupForm");
const message = document.getElementById("signupMessage");

// ==========================================
// PASSWORD TOGGLE
// ==========================================

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirm = document.getElementById("toggleConfirmPassword");

if (togglePassword) {

    togglePassword.onclick = () => {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        }

        else {

            password.type = "password";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    };

}

if (toggleConfirm) {

    toggleConfirm.onclick = () => {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";

            toggleConfirm.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        }

        else {

            confirmPassword.type = "password";

            toggleConfirm.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    };

}

// ==========================================
// SIGNUP
// ==========================================

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const pass =
        password.value.trim();

    const confirm =
        confirmPassword.value.trim();

    message.style.color = "#ef4444";

    //---------------------------------------
    // VALIDATION
    //---------------------------------------

    if (!username || !email || !pass || !confirm) {

        message.innerHTML =
            "Please fill all fields.";

        return;

    }

    if (pass !== confirm) {

        message.innerHTML =
            "Passwords do not match.";

        return;

    }

    if (pass.length < 6) {

        message.innerHTML =
            "Password must contain at least 6 characters.";

        return;

    }

    message.style.color = "#60a5fa";
    message.innerHTML = "Creating account...";

    try {

        const response = await fetch(

            `${API_URL}/auth/signup`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    username: username,

                    email: email,

                    password: pass

                })

            }

        );

        const data = await response.json();

        //---------------------------------------
        // ERROR
        //---------------------------------------

        if (!response.ok) {

            message.style.color = "#ef4444";

            message.innerHTML =
                data.detail || "Signup Failed";

            return;

        }

        //---------------------------------------
        // SUCCESS
        //---------------------------------------

        message.style.color = "#22c55e";

        message.innerHTML =
            "Account Created Successfully ✓";

        //---------------------------------------
        // SAVE EMAIL
        //---------------------------------------

        localStorage.setItem("email", email);

        //---------------------------------------
        // OPEN LOGIN POPUP
        //---------------------------------------

        setTimeout(() => {

            if (
                window.parent &&
                window.parent.openLogin
            ) {

                window.parent.openLogin();

            }

        }, 1000);

    }

    catch (err) {

        console.error(err);

        message.style.color = "#ef4444";

        message.innerHTML =
            "Unable to connect to server.";

    }

});