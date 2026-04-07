document.addEventListener("DOMContentLoaded", () => {
    const session = LuxuryHub.readSession();

    const steps = [
        document.getElementById("nail-step-1"),
        document.getElementById("nail-step-2"),
        document.getElementById("nail-step-3"),
    ];

    const openStep = (index) => {
        steps.forEach((step, i) => step.classList.toggle("active-step", i === index));
    };

    document.getElementById("nailName").value = session?.firstName || session?.name || "";

    document.getElementById("nailQuestionForm").addEventListener("submit", (event) => {
        event.preventDefault();
        openStep(1);
    });

    document.getElementById("nailAppointmentForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const payload = {
            userName: document.getElementById("nailName").value,
            email: session?.email || LuxuryHub.readSession()?.email || "",
            category: "salon-nails",
            service: `${document.getElementById("nailStyle").value} / ${document.getElementById("nailLength").value}`,
            bookingType: "salon",
            date: document.getElementById("nailDate").value,
            time: document.getElementById("nailTime").value,
            numberOfPeople: 1,
            notes:
                document.getElementById("nailRequirement").value ||
                document.getElementById("nailTheme").value ||
                "No extra requirement",
            amount: 65,
            returnPath: "selon/nails.html",
        };

        LuxuryHub.submitAppointment(payload)
            .then(() => {
                document.getElementById("nailConfirmName").textContent = payload.userName;
                document.getElementById("nailConfirmStyle").textContent = document.getElementById("nailStyle").value;
                document.getElementById("nailConfirmLength").textContent = document.getElementById("nailLength").value;
                document.getElementById("nailConfirmDate").textContent = payload.date;
                document.getElementById("nailConfirmTime").textContent = payload.time;
                document.getElementById("nailConfirmRequirement").textContent = payload.notes;
                openStep(2);
                setTimeout(() => {
                    window.location.href = "../thank-you.html";
                }, 500);
            })
            .catch((error) => {
                console.error(error);
                alert(error.message || "Unable to save booking");
            });
    });
});
