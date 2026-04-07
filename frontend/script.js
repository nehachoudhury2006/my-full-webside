document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("welcomeForm");
    const input = document.getElementById("user-name-input");

    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = input.value.trim();
        if (!name) {
            alert("Please enter your name.");
            input.focus();
            return;
        }
        LuxuryHub.setPendingName(name);
        window.location.href = "desboad/welcome.html";
    });
});
