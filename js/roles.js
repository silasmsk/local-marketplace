// Load and apply the saved user role
const roleSelect = document.getElementById("roleSelect");

const savedRole =
    localStorage.getItem("currentRole") || "visitor";

roleSelect.value = savedRole;

applyRole(savedRole);

roleSelect.addEventListener("change", function () {
    const selectedRole = roleSelect.value;

    localStorage.setItem("currentRole", selectedRole);

    applyRole(selectedRole);

    if (
        window.location.pathname.endsWith("create.html") &&
        selectedRole !== "member"
    ) {
        window.location.href = "index.html";
        return;
    }

    if (window.location.pathname.endsWith("dashboard.html")) {
        window.location.reload();
    }
});
// Show or hide interface elements based on the selected role
function applyRole(role) {
    const memberOnlyElements =
        document.querySelectorAll(".member-only");

    const moderatorOnlyElements =
        document.querySelectorAll(".moderator-only");

    memberOnlyElements.forEach(function (element) {
        element.style.display =
            role === "member" ? "" : "none";
    });

    moderatorOnlyElements.forEach(function (element) {
        element.style.display =
            role === "moderator" ? "" : "none";
    });
}

const createLinks =
    document.querySelectorAll('a[href="create.html"]');

createLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        localStorage.removeItem("editListingId");
    });
});