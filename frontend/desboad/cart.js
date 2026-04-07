document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll(".menu-item").forEach((item) => {
        const href = item.getAttribute("href");
        if (href && href.endsWith(currentPath)) {
            item.classList.add("active");
        }
    });

    const cartGrid = document.getElementById("bookingCartGrid");
    const cartGrandTotal = document.getElementById("cartGrandTotal");
    const user = LuxuryHub.getCurrentUser();
    const email = user?.email || LuxuryHub.readSession()?.email || "";
    let currentAppointments = [];

    const renderCart = (appointments) => {
        currentAppointments = appointments;

        if (!appointments.length) {
            cartGrid.innerHTML = `
                <article class="cart-empty">
                    <h3>No bookings yet</h3>
                    <p>Once you book salon, spa, room, or dining items, they will appear here.</p>
                </article>
            `;
            cartGrandTotal.textContent = "Total: $0";
            return;
        }

        const grouped = appointments.reduce((acc, appointment) => {
            const key = appointment.bookingType || appointment.category || "other";
            if (!acc[key]) acc[key] = [];
            acc[key].push(appointment);
            return acc;
        }, {});

        const total = appointments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        cartGrandTotal.textContent = `Total: $${total.toFixed(2)}`;

        cartGrid.innerHTML = Object.entries(grouped)
            .map(([group, items]) => {
                const sectionTotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
                const list = items
                    .map(
                        (item) => `
                            <div class="cart-item">
                                <strong>${item.userName || user?.fullname || "Guest"}</strong>
                                <span>${item.service || "Custom booking"}</span>
                                <small>${item.date} at ${item.time}</small>
                                <em>$${(Number(item.amount) || 0).toFixed(2)}</em>
                            </div>
                        `
                    )
                    .join("");

                const sourceCategory = items[0]?.category || "";

                return `
                    <article class="cart-category-card">
                        <div class="cart-category-header">
                            <div>
                                <p class="card-kicker">${group.replace(/-/g, " ")}</p>
                                <h3>${items.length} booking${items.length > 1 ? "s" : ""}</h3>
                            </div>
                            <div class="cart-category-actions">
                                <strong>$${sectionTotal.toFixed(2)}</strong>
                                <button class="remove-category-btn" data-group="${group}" data-category="${sourceCategory}">Remove</button>
                            </div>
                        </div>
                        <div class="cart-category-list">${list}</div>
                    </article>
                `;
            })
            .join("");

        cartGrid.querySelectorAll(".remove-category-btn").forEach((button) => {
            button.addEventListener("click", async () => {
                try {
                    const nextAppointments = await LuxuryHub.removeAppointmentCategory({
                        email,
                        bookingType: button.dataset.group,
                        category: button.dataset.category,
                    });
                    renderCart(nextAppointments);
                } catch (error) {
                    console.error(error);
                    alert(error.message || "Unable to remove category");
                }
            });
        });
    };

    LuxuryHub.getUserAppointments(email).then(renderCart);

    const feedbackModal = document.getElementById("feedbackModal");
    const logoutButton = document.getElementById("cartLogoutButton");
    const skipFeedback = document.getElementById("skipFeedback");
    const submitFeedback = document.getElementById("submitFeedback");
    const feedbackInput = document.getElementById("feedbackInput");

    const completeLogout = () => {
        const feedbackEntries = JSON.parse(localStorage.getItem("luxuryHubFeedback") || "[]");
        const feedback = feedbackInput.value.trim();
        if (feedback) {
            feedbackEntries.unshift({
                userName: user?.fullname || LuxuryHub.readSession()?.name || "Guest",
                email,
                message: feedback,
                createdAt: new Date().toISOString(),
            });
            localStorage.setItem("luxuryHubFeedback", JSON.stringify(feedbackEntries));
        }

        LuxuryHub.clearSession();
        window.location.href = logoutButton.dataset.redirect || "../index.html";
    };

    logoutButton.addEventListener("click", () => {
        feedbackModal.hidden = false;
    });

    skipFeedback.addEventListener("click", completeLogout);
    submitFeedback.addEventListener("click", completeLogout);
});
