const LuxuryHub = (() => {
    const storageKey = "luxuryHubSession";
    const userKey = "user";
    const appointmentKey = "luxuryHubLatestAppointment";
    const appointmentListKey = "luxuryHubAppointments";
    const pendingNameKey = "luxuryHubPendingName";
    const usersKey = "luxuryHubUsers";
    const apiBaseUrl = "/api/v1";

    const initialsFromName = (name = "") =>
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || "")
            .join("") || "GH";

    const readJson = (key, fallback = null) => {
        try {
            return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
        } catch {
            return fallback;
        }
    };

    const writeJson = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
        return value;
    };

    const readSession = () => readJson(storageKey, null);

    const writeSession = (session) => writeJson(storageKey, session);

    const clearSession = () => {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(userKey);
    };

    const readStoredUser = () => readJson(userKey, null);

    const writeStoredUser = (user) => writeJson(userKey, user);

    const readUsers = () => readJson(usersKey, []);

    const writeUsers = (users) => writeJson(usersKey, users);

    const buildSession = ({ name, email }) => ({
        name: name.trim(),
        email: email.trim(),
        provider: "Local",
        avatar: initialsFromName(name),
    });

    const createSession = ({ name, email }) => {
        const session = buildSession({ name, email });
        writeSession(session);
        writeStoredUser({
            fullname: session.name,
            email: session.email,
        });
        return session;
    };

    const syncUserSession = (user) => {
        const name = user.fullname || user.username || "Guest";
        writeStoredUser(user);
        return writeSession(
            buildSession({
                name,
                email: user.email || "",
            })
        );
    };

    const seedNameSession = (name) =>
        createSession({
            name,
            email: `${name.trim().toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        });

    const setPendingName = (name) => {
        localStorage.setItem(pendingNameKey, name.trim());
    };

    const getPendingName = () => localStorage.getItem(pendingNameKey) || "";

    const clearPendingName = () => localStorage.removeItem(pendingNameKey);

    const findUserByEmail = (email) =>
        readUsers().find((user) => user.email.toLowerCase() === email.trim().toLowerCase());

    const saveUser = (user) => {
        const users = readUsers();
        const email = user.email.trim().toLowerCase();
        const nextUsers = users.filter((item) => item.email.toLowerCase() !== email);
        nextUsers.push({ ...user, email });
        writeUsers(nextUsers);
        return user;
    };

    const getCurrentUser = () => readStoredUser() || readSession();

    const updateAuthVisibility = (session) => {
        document.querySelectorAll("[data-auth-state='guest']").forEach((node) => {
            node.hidden = Boolean(session);
        });
        document.querySelectorAll("[data-auth-state='user']").forEach((node) => {
            node.hidden = !session;
        });
    };

    const updateProfile = (session) => {
        const storedUser = readStoredUser();
        const activeSession =
            session ||
            readSession() ||
            (storedUser
                ? buildSession({
                      name: storedUser.fullname || storedUser.username || "Guest",
                      email: storedUser.email || "",
                  })
                : null);

        updateAuthVisibility(activeSession);

        document.querySelectorAll("[data-user-name]").forEach((node) => {
            node.textContent = activeSession?.name || node.dataset.fallbackName || "Guest";
        });

        document.querySelectorAll("[data-user-email]").forEach((node) => {
            node.textContent = activeSession?.email || "Not connected";
        });

        document.querySelectorAll("[data-user-avatar]").forEach((node) => {
            node.textContent = activeSession?.avatar || "G";
        });
    };

    const ensureModal = () => {
        let modal = document.getElementById("authModal");
        if (modal) return modal;

        modal = document.createElement("div");
        modal.id = "authModal";
        modal.className = "auth-modal";
        modal.innerHTML = `
            <div class="auth-panel">
                <div class="auth-google-badge">Account Login</div>
                <h2>Connect your account</h2>
                <p>This demo stores the session locally for this project.</p>
                <form class="auth-form" id="authForm">
                    <label>
                        Full name
                        <input id="authName" name="name" type="text" placeholder="Neha Choudhury" required>
                    </label>
                    <label>
                        Email address
                        <input id="authEmail" name="email" type="email" placeholder="name@gmail.com" required>
                    </label>
                    <div class="auth-actions">
                        <button type="button" class="auth-secondary" id="authCancel">Cancel</button>
                        <button type="submit" class="auth-primary">Sign in</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener("click", (event) => {
            if (event.target === modal) modal.classList.remove("is-open");
        });

        modal.querySelector("#authCancel").addEventListener("click", () => {
            modal.classList.remove("is-open");
        });

        modal.querySelector("#authForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const name = modal.querySelector("#authName").value;
            const email = modal.querySelector("#authEmail").value;
            const session = createSession({ name, email });
            clearPendingName();
            modal.classList.remove("is-open");
            updateProfile(session);
            const redirect = modal.dataset.redirect;
            if (redirect) window.location.href = redirect;
        });

        return modal;
    };

    const openGoogleModal = ({ redirect, prefillName = "", prefillEmail = "" } = {}) => {
        const modal = ensureModal();
        modal.dataset.redirect = redirect || "";
        modal.querySelector("#authName").value = prefillName;
        modal.querySelector("#authEmail").value = prefillEmail;
        modal.classList.add("is-open");
    };

    const bindActions = () => {
        document.querySelectorAll("[data-google-login]").forEach((button) => {
            if (button.dataset.bound === "true") return;
            button.dataset.bound = "true";
            button.addEventListener("click", () => {
                const session = readSession();
                if (session) {
                    updateProfile(session);
                    if (button.dataset.redirect) window.location.href = button.dataset.redirect;
                    return;
                }

                const nameInput = document.getElementById("user-name-input");
                const prefillName = nameInput?.value?.trim() || "";
                const prefillEmail = prefillName
                    ? `${prefillName.toLowerCase().replace(/\s+/g, ".")}@mail.com`
                    : "";
                openGoogleModal({
                    redirect: button.dataset.redirect || "",
                    prefillName,
                    prefillEmail,
                });
            });
        });

        document.querySelectorAll("[data-logout]").forEach((button) => {
            if (button.dataset.bound === "true") return;
            button.dataset.bound = "true";
            button.addEventListener("click", () => {
                clearSession();
                updateProfile(null);
                const redirect = button.dataset.redirect;
                if (redirect) window.location.href = redirect;
            });
        });
    };

    const protectPage = () => {
        const body = document.body;
        if (body.dataset.protect !== "true") return;

        const session = readSession() || readStoredUser();
        if (!session) {
            window.location.href = body.dataset.home || "../index.html";
        }
    };

    const saveLatestAppointment = (appointment) => writeJson(appointmentKey, appointment);

    const getLatestAppointment = () => readJson(appointmentKey, null);

    const readAppointments = () => readJson(appointmentListKey, []);

    const writeAppointments = (appointments) => writeJson(appointmentListKey, appointments);

    const submitAppointment = async ({
        userName,
        email,
        category,
        service = "",
        bookingType = "",
        date,
        time,
        numberOfPeople = 1,
        notes = "",
        amount = 0,
        returnPath = "desboard.html",
    }) => {
        const payload = {
            userName,
            email,
            category,
            service,
            bookingType,
            date,
            time,
            numberOfPeople,
            notes,
            amount,
        };

        const body = new URLSearchParams(
            Object.entries(payload).reduce((acc, [key, value]) => {
                acc[key] = String(value ?? "");
                return acc;
            }, {})
        );

        const response = await fetch(`${apiBaseUrl}/appointments`, {
            method: "POST",
            body,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to save appointment");
        }

        const savedAppointment = {
            ...payload,
            _id: data.data?._id,
            createdAt: data.data?.createdAt,
            returnPath,
        };

        const appointments = readAppointments();
        writeAppointments([savedAppointment, ...appointments]);
        saveLatestAppointment(savedAppointment);

        return data.data;
    };

    const getUserAppointments = async (email) => {
        if (!email?.trim()) {
            return [];
        }

        try {
            const response = await fetch(
                `${apiBaseUrl}/appointments?email=${encodeURIComponent(email.trim())}`
            );
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to fetch appointments");
            }

            writeAppointments(data.data || []);
            return data.data || [];
        } catch (_error) {
            return readAppointments().filter(
                (item) => item.email?.toLowerCase() === email.trim().toLowerCase()
            );
        }
    };

    const removeAppointmentCategory = async ({ email, category = "", bookingType = "" }) => {
        if (!email?.trim()) {
            throw new Error("email is required");
        }

        const params = new URLSearchParams({
            email: email.trim(),
        });

        if (bookingType) {
            params.set("bookingType", bookingType);
        } else if (category) {
            params.set("category", category);
        } else {
            throw new Error("category or bookingType is required");
        }

        const response = await fetch(`${apiBaseUrl}/appointments?${params.toString()}`, {
            method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to remove category");
        }

        const nextAppointments = readAppointments().filter((item) => {
            if (item.email?.toLowerCase() !== email.trim().toLowerCase()) {
                return true;
            }

            if (bookingType) {
                return item.bookingType !== bookingType;
            }

            return item.category !== category;
        });

        writeAppointments(nextAppointments);
        return nextAppointments;
    };

    const init = () => {
        protectPage();
        bindActions();
        updateProfile();
    };

    return {
        init,
        readSession,
        readStoredUser,
        clearSession,
        createSession,
        syncUserSession,
        seedNameSession,
        setPendingName,
        getPendingName,
        clearPendingName,
        readUsers,
        findUserByEmail,
        saveUser,
        openGoogleModal,
        updateProfile,
        getCurrentUser,
        submitAppointment,
        getLatestAppointment,
        getUserAppointments,
        removeAppointmentCategory,
        readAppointments,
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    LuxuryHub.init();
});
