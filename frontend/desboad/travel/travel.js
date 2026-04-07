document.addEventListener("DOMContentLoaded", () => {
    const routeSelect = document.getElementById("travelRouteSelect");
    const searchInput = document.getElementById("travelSearchInput");
    const searchButton = document.getElementById("travelSearchButton");
    const aiButton = document.getElementById("aiButton");

    const routeMap = {
        bali: "destinations/bali.html",
        "bali indonesia": "destinations/bali.html",
        paris: "destinations/paris.html",
        "paris france": "destinations/paris.html",
        swiss: "destinations/swiss-alps.html",
        "swiss alps": "destinations/swiss-alps.html",
        flights: "transport/flights.html",
        flight: "transport/flights.html",
        airport: "transport/flights.html",
        trains: "transport/trains.html",
        train: "transport/trains.html",
        rail: "transport/trains.html",
        ships: "transport/ships.html",
        ship: "transport/ships.html",
        yacht: "transport/ships.html",
        yachts: "transport/ships.html",
    };

    const openRoute = (route) => {
        if (!route) return;
        window.location.href = route;
    };

    routeSelect?.addEventListener("change", (event) => {
        openRoute(event.target.value);
    });

    const handleSearch = () => {
        const query = searchInput?.value?.trim().toLowerCase() || "";
        if (!query) {
            if (routeSelect?.value) {
                openRoute(routeSelect.value);
                return;
            }
            alert("Type a place or transport, or choose one from Select Place.");
            return;
        }

        const matchedRoute = Object.entries(routeMap).find(([key]) => query.includes(key))?.[1];
        if (matchedRoute) {
            openRoute(matchedRoute);
            return;
        }

        alert("Try searching Bali, Paris, Swiss Alps, flight, train, or ship.");
    };

    searchButton?.addEventListener("click", handleSearch);
    searchInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    });

    aiButton?.addEventListener("click", () => {
        alert("AI travel assistant placeholder: later you can plug in your model here for route planning.");
    });

    const navBar = document.querySelector(".travel-nav");
    if (navBar) {
        window.addEventListener("scroll", () => {
            navBar.style.boxShadow = window.scrollY > 50 ? "0 12px 36px rgba(19, 32, 34, 0.12)" : "none";
        });
    }
});
