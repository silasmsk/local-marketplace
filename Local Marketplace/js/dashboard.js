function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

const dashboardListings =
    document.getElementById("dashboardListings");

const dashboardTitle =
    document.getElementById("dashboardTitle");

const currentRole =
    localStorage.getItem("currentRole") || "visitor";

const currentUserId = "member-1";

const favoriteListings =
    document.getElementById("favoriteListings");

const receivedInquiries =
    document.getElementById("receivedInquiries");

let allListings =
    JSON.parse(localStorage.getItem("listings")) || listings;

// Render dashboard content according to the selected role
function renderDashboard() {
    dashboardListings.innerHTML = "";

    if (currentRole === "member") {
        dashboardTitle.textContent = "My Listings";

        const myListings = allListings.filter(function (listing) {
            return listing.ownerId === currentUserId;
        });

        renderMemberListings(myListings);
        renderFavorites();
        renderInquiries();
        return;
    }

    if (currentRole === "moderator") {
        dashboardTitle.textContent = "Moderator Dashboard";

        const reportedListings = allListings.filter(function (listing) {
            return listing.reported === true;
        });

        renderModeratorListings(reportedListings);
        return;
    }

    dashboardTitle.textContent = "Access Denied";

    dashboardListings.innerHTML = `
        <p>You must be a member or moderator to access this page.</p>
        <a href="index.html">Back to Home</a>
    `;
}

function renderMemberListings(myListings) {
    if (myListings.length === 0) {
        dashboardListings.innerHTML = `
            <p>You have not created any listings yet.</p>
        `;
        return;
    }

    myListings.forEach(function (listing) {
        const card = document.createElement("article");

        card.classList.add("listing-card");

        card.innerHTML = `
            <h3>${escapeHTML(listing.title)}</h3>
            <p>${escapeHTML(listing.description)}</p>
            <p>Category: ${escapeHTML(listing.category)}</p>
            <p>Type: ${escapeHTML(listing.type)}</p>
            <p>Price: €${listing.price}</p>
            <p>Location: ${escapeHTML(listing.location)}</p>

            <button
                type="button"
                class="edit-button"
                data-id="${listing.id}">
                Edit
            </button>

            <button
                type="button"
                class="delete-button"
                data-id="${listing.id}">
                Delete
            </button>
    `;

        dashboardListings.appendChild(card);
    });
}

function renderFavorites() {
    favoriteListings.innerHTML = "";

    const favoriteIds =
        JSON.parse(localStorage.getItem("favorites")) || [];

    const favorites = allListings.filter(function (listing) {
        return favoriteIds.includes(listing.id);
    });

    if (favorites.length === 0) {
        favoriteListings.innerHTML = `
            <p>You have no favorite listings.</p>
        `;
        return;
    }

    favorites.forEach(function (listing) {
        const card = document.createElement("article");

        card.classList.add("listing-card");

        card.innerHTML = `
            <h3>${escapeHTML(listing.title)}</h3>
            <p>${escapeHTML(listing.description)}</p>
            <p>Price: €${listing.price}</p>

            <button
                type="button"
                class="remove-favorite-button"
                data-id="${listing.id}">
                Remove from Favorites
            </button>
        `;

        favoriteListings.appendChild(card);
    });
}
// Render inquiries received for the current member
function renderInquiries() {
    receivedInquiries.innerHTML = "";

    const inquiries =
        JSON.parse(localStorage.getItem("inquiries")) || [];

    const myInquiries = inquiries.filter(function (inquiry) {
        return inquiry.sellerOwnerId === currentUserId;
    });

    if (myInquiries.length === 0) {
        receivedInquiries.textContent =
            "You have no received inquiries.";
        return;
    }

    myInquiries.forEach(function (inquiry) {
        const card = document.createElement("article");
        card.classList.add("inquiry-card");

        const sender = document.createElement("h3");
        sender.textContent = "From: " + inquiry.senderName;

        const email = document.createElement("p");
        email.textContent = "Email: " + inquiry.senderEmail;

        const message = document.createElement("p");
        message.textContent = inquiry.message;

        const dismissButton = document.createElement("button");
        dismissButton.type = "button";
        dismissButton.classList.add("dismiss-inquiry-button");
        dismissButton.dataset.id = inquiry.id;
        dismissButton.textContent = "Dismiss";

        card.append(
            sender,
            email,
            message,
            dismissButton
        );

        receivedInquiries.appendChild(card);
    });
}
// Render listings that have been reported for moderation
function renderModeratorListings(reportedListings) {
    if (reportedListings.length === 0) {
        dashboardListings.innerHTML = `
            <p>There are no reported listings.</p>
        `;
        return;
    }

    reportedListings.forEach(function (listing) {
        const card = document.createElement("article");

        card.classList.add("listing-card");

        card.innerHTML = `
            <h3>${escapeHTML(listing.title)}</h3>
            <p>${escapeHTML(listing.description)}</p>
            <p>Seller: ${escapeHTML(listing.sellerName)}</p>
            <p>Category: ${escapeHTML(listing.category)}</p>
            <p>Status: Reported</p>
            
            <button
                type="button"
                class="remove-button"
                data-id="${listing.id}">
                Remove Listing
            </button>

            <button
                type="button"
                class="dismiss-report-button"
                data-id="${listing.id}">
                Dismiss Report
            </button>
        `;

        dashboardListings.appendChild(card);
    });
}

dashboardListings.addEventListener("click", function (event) {
    const listingId = Number(event.target.dataset.id);

    if (
        currentRole === "member" &&
        event.target.classList.contains("edit-button")
    ) {
        localStorage.setItem("editListingId", listingId);
        window.location.href = "create.html";
        return;
    }

    if (
        currentRole === "member" &&
        event.target.classList.contains("delete-button")
    ) {
        const shouldDelete = confirm(
            "Are you sure you want to delete this listing?"
        );

        if (!shouldDelete) {
            return;
        }

        allListings = allListings.filter(function (listing) {
            return !(
                listing.id === listingId &&
                listing.ownerId === currentUserId
            );
        });
    }

    if (
        currentRole === "moderator" &&
        event.target.classList.contains("remove-button")
    ) {
        const shouldRemove = confirm(
            "Remove this reported listing?"
        );

        if (!shouldRemove) {
            return;
        }

        allListings = allListings.filter(function (listing) {
            return listing.id !== listingId;
        });
    }

    if (
        currentRole === "moderator" &&
        event.target.classList.contains("dismiss-report-button")
    ) {
        const listing = allListings.find(function (item) {
            return item.id === listingId;
        });

        if (listing) {
            listing.reported = false;
        }
    }

    localStorage.setItem(
        "listings",
        JSON.stringify(allListings)
    );

    renderDashboard();
});

favoriteListings.addEventListener("click", function (event) {
    if (
        !event.target.classList.contains(
            "remove-favorite-button"
        )
    ) {
        return;
    }

    const listingId = Number(event.target.dataset.id);

    let favoriteIds =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favoriteIds = favoriteIds.filter(function (id) {
        return id !== listingId;
    });

    localStorage.setItem(
        "favorites",
        JSON.stringify(favoriteIds)
    );

    renderFavorites();
});

receivedInquiries.addEventListener("click", function (event) {
    if (
        !event.target.classList.contains(
            "dismiss-inquiry-button"
        )
    ) {
        return;
    }

    const inquiryId = Number(event.target.dataset.id);

    let inquiries =
        JSON.parse(localStorage.getItem("inquiries")) || [];

    inquiries = inquiries.filter(function (inquiry) {
        return inquiry.id !== inquiryId;
    });

    localStorage.setItem(
        "inquiries",
        JSON.stringify(inquiries)
    );

    renderInquiries();
});

renderDashboard();