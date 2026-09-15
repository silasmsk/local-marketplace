// Allow only members to access the create/edit page
const currentRole =
    localStorage.getItem("currentRole") || "visitor";

if (currentRole !== "member") {
    alert("Only members can create or edit listings.");
    window.location.href = "index.html";
}
const listingForm = document.getElementById("listingForm");
const editListingId = Number(
    localStorage.getItem("editListingId")
);

const storedListings =
    JSON.parse(localStorage.getItem("listings")) || listings;

const listingToEdit = storedListings.find(function (listing) {
    return listing.id === editListingId;
});
// Load existing listing data when editing
if (listingToEdit) {
    document.getElementById("formTitle").textContent = "Edit Listing";
    document.getElementById("submitButton").textContent = "Save Changes";

    document.getElementById("title").value = listingToEdit.title;
    document.getElementById("description").value = listingToEdit.description;
    document.getElementById("price").value = listingToEdit.price;
    document.getElementById("category").value = listingToEdit.category;
    document.getElementById("type").value = listingToEdit.type;
    document.getElementById("condition").value = listingToEdit.condition;
    document.getElementById("location").value = listingToEdit.location;
    document.getElementById("sellerName").value = listingToEdit.sellerName;
    document.getElementById("image").value = listingToEdit.image || "";
}
// Validate and save a new or edited listing
listingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    clearErrors();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = document.getElementById("price").value.trim();
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;
    const condition = document.getElementById("condition").value;
    const location = document.getElementById("location").value.trim();
    const sellerName = document.getElementById("sellerName").value.trim();
    const image = document.getElementById("image").value.trim();

    let isValid = true;

    if (title.length < 3) {
        showError("titleError", "Title must be at least 3 characters.");
        isValid = false;
    }

    if (description.length < 10) {
        showError(
            "descriptionError",
            "Description must be at least 10 characters."
        );
        isValid = false;
    }

    if (price === "" || Number(price) < 0) {
        showError("priceError", "Price must be 0 or greater.");
        isValid = false;
    }

    if (category === "") {
        showError("categoryError", "Please select a category.");
        isValid = false;
    }

    if (type === "") {
        showError("typeError", "Please select a listing type.");
        isValid = false;
    }

    if (condition === "") {
        showError("conditionError", "Please select a condition.");
        isValid = false;
    }

    if (location.length < 2) {
        showError("locationError", "Please enter a valid location.");
        isValid = false;
    }

    if (sellerName.length < 2) {
        showError("sellerNameError", "Please enter a valid seller name.");
        isValid = false;
    }

    if (image !== "" && !isValidUrl(image)) {
        showError("imageError", "Please enter a valid image URL.");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    if (listingToEdit) {
        const listingIndex = storedListings.findIndex(function (listing) {
            return listing.id === editListingId;
        });

        storedListings[listingIndex] = {
            ...listingToEdit,
            title: title,
            description: description,
            price: Number(price),
            category: category,
            type: type,
            condition: condition,
            location: location,
            sellerName: sellerName,
            image:
                image !== ""
                    ? image
                    : "https://via.placeholder.com/300x200"
        };

        localStorage.removeItem("editListingId");

        localStorage.setItem(
            "listings",
            JSON.stringify(storedListings)
        );

        showSuccessMessage("Listing updated successfully.");
    } else {
        const newListing = {
            id: Date.now(),
            title: title,
            description: description,
            price: Number(price),
            category: category,
            type: type,
            condition: condition,
            location: location,
            sellerName: sellerName,
            ownerId: "member-1",
            image:
                image !== ""
                    ? image
                    : "https://via.placeholder.com/300x200",
            createdAt: new Date().toISOString().split("T")[0],
            reported: false
        };

        storedListings.push(newListing);

        localStorage.setItem(
            "listings",
            JSON.stringify(storedListings)
        );

        showSuccessMessage("Listing created successfully.");
    }

    listingForm.reset();

    setTimeout(function () {
        window.location.href = "dashboard.html";
    }, 1000);


});

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearErrors() {
    const errorMessages =
        document.querySelectorAll(".error-message");

    errorMessages.forEach(function (errorMessage) {
        errorMessage.textContent = "";
    });
}

function isValidUrl(value) {
    if (value.startsWith("images/")) {
        return true;
    }

    try {
        const url = new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );
    } catch {
        return false;
    }
}

function showSuccessMessage(message) {
    const successMessage =
        document.getElementById("formSuccessMessage");

    successMessage.textContent = message;
    successMessage.hidden = false;
}




