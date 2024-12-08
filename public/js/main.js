// Load featured listings
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedListings();
});

async function loadFeaturedListings() {
    try {
        const response = await fetch('/listings/featured');
        const listings = await response.json();
        
        const listingsContainer = document.getElementById('featured-listings');
        if (!listingsContainer) return;

        listingsContainer.innerHTML = listings.map(listing => `
            <div class="col-md-4">
                <div class="card listing-card">
                    <img src="${listing.image.url}" class="card-img-top" alt="${listing.title}">
                    <div class="card-body">
                        <h5 class="card-title">${listing.title}</h5>
                        <p class="listing-location">
                            <i class="fas fa-map-marker-alt"></i> ${listing.location}, ${listing.country}
                        </p>
                        <p class="listing-price">$${listing.price} / night</p>
                        <a href="/listings/${listing._id}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading featured listings:', error);
    }
}

// Price range filter
const priceSelect = document.querySelector('select[name="price"]');
if (priceSelect) {
    priceSelect.addEventListener('change', function() {
        const selectedPrice = this.value;
        if (selectedPrice) {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('price', selectedPrice);
            window.location.href = currentUrl.toString();
        }
    });
}

// Flash messages auto-dismiss
const flashMessages = document.querySelectorAll('.alert');
flashMessages.forEach(message => {
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 500);
    }, 3000);
});

// Image preview for new listings
const imageInput = document.querySelector('input[type="file"]');
if (imageInput) {
    imageInput.addEventListener('change', function(e) {
        const preview = document.getElementById('image-preview');
        if (preview && e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });
}

// Form validation
const forms = document.querySelectorAll('.needs-validation');
forms.forEach(form => {
    form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    });
});
