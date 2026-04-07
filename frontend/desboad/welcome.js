document.addEventListener("DOMContentLoaded", () => {
    const name = LuxuryHub.getPendingName() || LuxuryHub.readSession()?.firstName || LuxuryHub.readSession()?.name || "Guest";
    document.getElementById("welcomeUserName").textContent = name;

    document.querySelectorAll("[data-auth-link]").forEach((button) => {
        button.addEventListener("click", () => {
            const mode = button.dataset.authLink;
            window.location.href = `login.html?mode=${mode}`;
        });
    });
});
