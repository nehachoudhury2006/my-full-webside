document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("transportBookingForm");
    const packageLabel = document.getElementById("packageLabel");
    const packageInput = document.getElementById("packageInput");
    const peopleInput = document.getElementById("transportPeople");
    const titleNode = document.getElementById("transportTitle");
    const introNode = document.getElementById("transportIntro");

    const config = {
        flights: {
            title: "Flight ticket booking page",
            intro: "Choose your route style, date, and travelers. This page behaves like the airport ticket section you asked for.",
            category: "travel-flight",
            bookingType: "travel",
            image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80",
            packages: {
                "international-business": { label: "International Business", amount: 780 },
                "premium-economy": { label: "Premium Economy", amount: 420 },
                "private-charter": { label: "Private Charter", amount: 1650 },
            },
        },
        trains: {
            title: "Luxury train ticket page",
            intro: "Pick the rail style, departure slot, and travelers for a scenic train-led route.",
            category: "travel-train",
            bookingType: "travel",
            image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80",
            packages: {
                "panoramic-rail": { label: "Panoramic Rail", amount: 260 },
                "overnight-sleeper": { label: "Overnight Sleeper", amount: 340 },
                "grand-carriage": { label: "Grand Carriage", amount: 490 },
            },
        },
        ships: {
            title: "Ship and yacht ticket page",
            intro: "Choose your sea route and number of guests, then reserve this water-led travel option.",
            category: "travel-ship",
            bookingType: "travel",
            image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
            packages: {
                "island-hopper": { label: "Island Hopper", amount: 210 },
                "sunset-cruise": { label: "Sunset Cruise", amount: 180 },
                "private-yacht": { label: "Private Yacht", amount: 920 },
            },
        },
    };

    const pageType = document.body.dataset.transportType;
    const packageKey = new URLSearchParams(window.location.search).get("package") || "";
    const pageConfig = config[pageType];
    const selectedPackage = pageConfig?.packages[packageKey];
    const user = LuxuryHub.getCurrentUser();

    if (!pageConfig || !selectedPackage) {
        window.location.href = "../trevel.html";
        return;
    }

    document.getElementById("visualCard").style.backgroundImage = `url('${pageConfig.image}')`;
    titleNode.textContent = pageConfig.title;
    introNode.textContent = pageConfig.intro;
    packageLabel.textContent = selectedPackage.label;
    packageInput.value = selectedPackage.label;
    document.getElementById("transportName").value =
        user?.fullname || LuxuryHub.readSession()?.name || "";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const people = Number(peopleInput.value) || 1;

        try {
            await LuxuryHub.submitAppointment({
                userName: document.getElementById("transportName").value,
                email: user?.email || LuxuryHub.readSession()?.email || "",
                category: pageConfig.category,
                bookingType: pageConfig.bookingType,
                service: selectedPackage.label,
                date: document.getElementById("transportDate").value,
                time: document.getElementById("transportTime").value,
                numberOfPeople: people,
                notes: document.getElementById("transportNotes").value || `${selectedPackage.label} reserved from travel section.`,
                amount: selectedPackage.amount * people,
                returnPath: `travel/transport/${pageType}.html`,
            });
            window.location.href = "../../thank-you.html";
        } catch (error) {
            console.error(error);
            alert(error.message || "Unable to book ticket");
        }
    });
});
