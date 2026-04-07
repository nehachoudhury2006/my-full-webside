const signInTab = document.getElementById("signInTab");
const logInTab = document.getElementById("logInTab");
const signInForm = document.getElementById("signInForm");
const logInForm = document.getElementById("logInForm");
const authHeadingName = document.getElementById("authHeadingName");
const apiBaseUrl = "/api/v1/users";

function openMode(mode) {
    const isSignup = mode === "signup";

    signInForm.classList.toggle("active-form", isSignup);
    logInForm.classList.toggle("active-form", !isSignup);
    signInTab.classList.toggle("active", isSignup);
    logInTab.classList.toggle("active", !isSignup);
}

function updateHeading(name) {
    authHeadingName.textContent = name || "Guest";
}

document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.togglePassword);
        const showPassword = input.type === "password";
        input.type = showPassword ? "text" : "password";
        button.textContent = showPassword ? "Hide" : "Show";
        button.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
    });
});

signInTab.addEventListener("click", () => openMode("signup"));
logInTab.addEventListener("click", () => openMode("login"));

document.getElementById("signInName").addEventListener("input", (event) => {
    updateHeading(event.target.value.trim());
});

document.getElementById("logInName").addEventListener("input", (event) => {
    updateHeading(event.target.value.trim());
});

signInForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = {
        fullname: document.getElementById("signInName").value.trim(),
        email: document.getElementById("signInEmail").value.trim(),
        username: document.getElementById("signInName").value.trim(),
        password: document.getElementById("signInPassword").value,
    };

    try {
        const body = new URLSearchParams(user);
        const response = await fetch(`${apiBaseUrl}/register`, {
            method: "POST",
            body,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Signup failed");
        }

        signInForm.reset();
        document.getElementById("logInEmail").value = user.email;
        document.getElementById("logInName").value = user.fullname;
        updateHeading(user.fullname);
        openMode("login");
        alert("Signup successful. Please log in.");
    } catch (error) {
        console.error(error);
        alert(error.message || "Server error");
    }
});

logInForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("logInEmail").value.trim();
    const password = document.getElementById("logInPassword").value;

    try {
        const body = new URLSearchParams({ email, password });
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: "POST",
            body,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("user", JSON.stringify(data.data));
        LuxuryHub.syncUserSession(data.data);
        window.location.href = "desboard.html";
    } catch (error) {
        console.error(error);
        alert(error.message || "Server error");
    }
});

openMode("login");
