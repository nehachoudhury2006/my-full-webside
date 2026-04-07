document.addEventListener("DOMContentLoaded", () => {
    const appointment = LuxuryHub.getLatestAppointment();

    if (!appointment) {
        window.location.href = "desboard.html";
        return;
    }

    document.getElementById("thankYouName").textContent = appointment.userName || "Guest";
    document.getElementById("thankYouCategory").textContent = appointment.category || "-";
    document.getElementById("thankYouService").textContent = appointment.service || "Custom request";
    document.getElementById("thankYouDate").textContent = appointment.date || "-";
    document.getElementById("thankYouTime").textContent = appointment.time || "-";
    document.getElementById("thankYouPeople").textContent = String(appointment.numberOfPeople || 1);
    document.getElementById("thankYouEmail").textContent = appointment.email || "-";
    document.getElementById("thankYouNotes").textContent =
        appointment.notes || "Please arrive 10 minutes early and keep your confirmation handy.";

    const bookAnotherLink = document.getElementById("bookAnotherLink");
    if (appointment.returnPath) {
        bookAnotherLink.href = appointment.returnPath;
    }
});
