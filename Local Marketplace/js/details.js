// Escape user-generated text before inserting it into HTML
function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

const listingDetails = document.getElementById("listingDetails");

const selectedListingId = Number(
    localStorage.getItem("selectedListingId")
);

const allListings =
    JSON.parse(localStorage.getItem("listings")) || listings;

const selectedListing = allListings.find(function (listing) {
    return listing.id === selectedListingId;
});

if (selectedListing) {
    listingDetails.innerHTML = `
        <article class="listing-detail-card">

            <img
                src="${escapeHTML(selectedListing.image)}"
                alt="${escapeHTML(selectedListing.title)}"
            >

            <h2>${escapeHTML(selectedListing.title)}</h2>

            <p>${escapeHTML(selectedListing.description)}</p>
            <p>Category: ${escapeHTML(selectedListing.category)}</p>
            <p>Type: ${escapeHTML(selectedListing.type)}</p>
            <p>Price: €${selectedListing.price}</p>
            <p>Location: ${escapeHTML(selectedListing.location)}</p>
            <p>Seller: ${escapeHTML(selectedListing.sellerName)}</p>
            <p>Date: ${escapeHTML(selectedListing.createdAt)}</p>
            <p>Condition: ${escapeHTML(selectedListing.condition)}</p>

            <button
                type="button"
                id="reportButton"
                data-id="${selectedListing.id}">
                Report Listing
            </button>

            <a href="index.html">Back to Listings</a>

        </article>
    `;
} else {
    listingDetails.innerHTML = `
        <p>Listing not found.</p>
        <a href="index.html">Back to Listings</a>
    `;
}

const contactForm = document.getElementById("contactForm");
// Validate and store seller inquiries using jQuery
$("#contactForm").on("submit", function (event) {
    event.preventDefault();

    document.getElementById("buyerNameError").textContent = "";
    document.getElementById("buyerEmailError").textContent = "";
    document.getElementById("messageError").textContent = "";

    const buyerName =
        document.getElementById("buyerName").value.trim();

    const buyerEmail =
        document.getElementById("buyerEmail").value.trim();

    const message =
        document.getElementById("message").value.trim();

    let isValid = true;

    if (!/^[\p{L}\s]+$/u.test(buyerName)) {
        document.getElementById("buyerNameError").textContent =
            "Name can only contain letters.";
        isValid = false;
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(buyerEmail)) {
        document.getElementById("buyerEmailError").textContent =
            "Please enter a valid email address.";
        isValid = false;
    }

    if (
        message.length < 10 ||
        !/\p{L}/u.test(message)
    ) {
        document.getElementById("messageError").textContent =
            "Message must contain letters and be at least 10 characters.";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const inquiries =
        JSON.parse(localStorage.getItem("inquiries")) || [];

    const newInquiry = {
        id: Date.now(),
        listingId: selectedListing.id,
        sellerName: selectedListing.sellerName,
        sellerOwnerId: selectedListing.ownerId,
        senderName: buyerName,
        senderEmail: buyerEmail,
        message: message
    };

    inquiries.push(newInquiry);

    localStorage.setItem(
        "inquiries",
        JSON.stringify(inquiries)
    );

    $("#contactSuccess")
        .text("Inquiry sent successfully.")
        .hide()
        .fadeIn(500);

    contactForm.reset();
});
// Mark the selected listing as reported
const reportButton =
    document.getElementById("reportButton");

if (reportButton) {
    reportButton.addEventListener("click", function () {
        const listingId =
            Number(reportButton.dataset.id);

        const storedListings =
            JSON.parse(localStorage.getItem("listings")) || listings;

        const listingToReport =
            storedListings.find(function (listing) {
                return listing.id === listingId;
            });

        if (!listingToReport) {
            return;
        }

        listingToReport.reported = true;

        localStorage.setItem(
            "listings",
            JSON.stringify(storedListings)
        );

        reportButton.textContent = "Reported";
        reportButton.disabled = true;
    });
}