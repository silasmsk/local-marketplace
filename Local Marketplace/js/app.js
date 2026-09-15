// Load listings from localStorage or use the initial dataset
const allListings =
    JSON.parse(localStorage.getItem("listings")) || listings;

const listingContainer = document.getElementById("listingContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const typeFilter = document.getElementById("typeFilter");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

// Render listing cards dynamically
function renderListings(listingsToShow) {
    listingContainer.innerHTML = "";

    listingsToShow.forEach(function (listing) {
        const card = document.createElement("article");

        const image = document.createElement("img");
        image.src = listing.image;
        image.alt = listing.title;

        const title = document.createElement("h3");
        title.textContent = listing.title;

        const description = document.createElement("p");
        description.textContent = listing.description;

        const category = document.createElement("p");
        category.textContent = "Category: " + listing.category;

        const type = document.createElement("p");
        type.textContent = "Type: " + listing.type;

        const price = document.createElement("p");
        price.textContent = "Price: €" + listing.price;

        const seller = document.createElement("p");
        seller.textContent = "Seller: " + listing.sellerName;

        const date = document.createElement("p");
        date.textContent = "Date: " + listing.createdAt;

        const condition = document.createElement("p");
        condition.textContent = "Condition: " + listing.condition;

        const favoriteButton = document.createElement("button");
        favoriteButton.type = "button";
        favoriteButton.classList.add("favorite-button");
        favoriteButton.dataset.id = listing.id;
        favoriteButton.textContent = "Add to Favorites";

        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.classList.add("details-button");
        detailsButton.dataset.id = listing.id;
        detailsButton.textContent = "View Details";

        card.append(
            image,
            title,
            description,
            category,
            type,
            price,
            seller,
            date,
            condition,
            favoriteButton,
            detailsButton
        );

        listingContainer.appendChild(card);
    });
}

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("favorite-button")) {
        const currentRole =
            localStorage.getItem("currentRole") || "visitor";

        if (currentRole !== "member") {
            alert("Only members can add favorites.");
            return;
        }

        const listingId = Number(event.target.dataset.id);

        const favorites =
            JSON.parse(localStorage.getItem("favorites")) || [];

        if (!favorites.includes(listingId)) {
            favorites.push(listingId);

            localStorage.setItem(
                "favorites",
                JSON.stringify(favorites)
            );
        }

        event.target.textContent = "Added to Favorites";
        event.target.disabled = true;
        return;
    }

    if (event.target.classList.contains("details-button")) {

        const listingId = event.target.dataset.id;

        localStorage.setItem("selectedListingId", listingId);

        window.location.href = "details.html";

    }

});

// Apply search and filter criteria without reloading the page
function applyFilters() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedType = typeFilter.value;
    const minPrice =
        minPriceInput.value === ""
            ? 0
            : Number(minPriceInput.value);

    const maxPrice =
        maxPriceInput.value === ""
            ? Infinity
            : Number(maxPriceInput.value);

    const filteredListings = allListings.filter(function (listing) {
        const matchesSearch =
            listing.title.toLowerCase().includes(searchText) ||
            listing.description.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "" ||
            listing.category === selectedCategory;

        const matchesType =
            selectedType === "" ||
            listing.type === selectedType;

        const matchesPrice =
            listing.price >= minPrice &&
            listing.price <= maxPrice;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesType &&
            matchesPrice
        );
    });

    renderListings(filteredListings);
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);
minPriceInput.addEventListener("input", applyFilters);
maxPriceInput.addEventListener("input", applyFilters);
renderListings(allListings);