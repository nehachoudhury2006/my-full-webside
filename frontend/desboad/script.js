document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll(".menu-item").forEach((item) => {
        const href = item.getAttribute("href");
        if (href && href.endsWith(currentPath)) {
            item.classList.add("active");
        }
    });
});
