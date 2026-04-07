document.addEventListener("DOMContentLoaded", () => {
    const session = LuxuryHub.readSession();

    const steps = [
        document.getElementById("skin-step-1"),
        document.getElementById("skin-step-2"),
        document.getElementById("skin-step-3"),
    ];

    const openStep = (index) => {
        steps.forEach((step, i) => step.classList.toggle("active-step", i === index));
    };

    document.getElementById("skinName").value = session?.firstName || session?.name || "";

    document.getElementById("skinQuestionForm").addEventListener("submit", (event) => {
        event.preventDefault();
        openStep(1);
    });

    document.getElementById("skinAppointmentForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const payload = {
            userName: document.getElementById("skinName").value,
            email: session?.email || LuxuryHub.readSession()?.email || "",
            category: "salon-skin",
            service: `${document.getElementById("skinConcern").value} / ${document.getElementById("skinType").value}`,
            bookingType: "salon",
            date: document.getElementById("skinDate").value,
            time: document.getElementById("skinTime").value,
            numberOfPeople: 1,
            notes:
                document.getElementById("skinRequirement").value ||
                document.getElementById("skinTreatment").value ||
                "No extra requirement",
            amount: 95,
            returnPath: "selon/skin.html",
        };

        LuxuryHub.submitAppointment(payload)
            .then(() => {
                document.getElementById("skinConfirmName").textContent = payload.userName;
                document.getElementById("skinConfirmConcern").textContent = document.getElementById("skinConcern").value;
                document.getElementById("skinConfirmType").textContent = document.getElementById("skinType").value;
                document.getElementById("skinConfirmDate").textContent = payload.date;
                document.getElementById("skinConfirmTime").textContent = payload.time;
                document.getElementById("skinConfirmRequirement").textContent = payload.notes;
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
