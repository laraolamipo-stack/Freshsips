// 1. Updated Smoothie price to 1200 to match your UI
const prices = { zobo: 500, tigernut: 700, smoothie: 1200 };
const counts = { zobo: 0, tigernut: 0, smoothie: 0 };
const MY_WHATSAPP = "2349055906883";

const locationSelect = document.getElementById('location');
const subtotalEl = document.getElementById('subtotal');
const deliveryEl = document.getElementById('delivery');
const grandTotalEl = document.getElementById('grandTotal');
const popTotal = document.getElementById('popTotal');

function updateUI() {
    let subtotal = 0;
    for (let key in counts) {
        subtotal += counts[key] * prices[key];
        // Ensure this ID exists in your HTML (e.g., <span id="qty-zobo">)
        const qtyEl = document.getElementById(`qty-${key}`);
        if (qtyEl) qtyEl.innerText = counts[key];
    }

    // 2. Added "|| 0" to prevent NaN if no location is selected
    const deliveryFee = parseInt(locationSelect.value) || 0;
    const total = subtotal + deliveryFee;

    subtotalEl.innerText = `₦${subtotal.toLocaleString()}`;
    deliveryEl.innerText = `₦${deliveryFee.toLocaleString()}`;
    grandTotalEl.innerText = `₦${total.toLocaleString()}`;
    if (popTotal) popTotal.innerText = `₦${total.toLocaleString()}`;
}

// Event Listeners for Plus/Minus Buttons
document.querySelectorAll('.btn-qty').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        if (btn.classList.contains('plus')) {
            counts[type]++;
        } else if (counts[type] > 0) {
            counts[type]--;
        }
        updateUI();
    });
});

locationSelect.addEventListener('change', updateUI);

// Copy Account Number Logic
document.getElementById('copyBtn').addEventListener('click', function() {
    navigator.clipboard.writeText("9055906883").then(() => {
        const originalText = this.innerText;
        this.innerText = "Copied!";
        setTimeout(() => this.innerText = originalText, 2000);
    });
});

// Form Submission & WhatsApp Redirect
document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const hasItems = Object.values(counts).some(c => c > 0);
    if (!hasItems) return alert("Please select a drink first!");

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const locName = locationSelect.options[locationSelect.selectedIndex].text;
    
    // 3. Cleaner Order Details Formatting
    let orderDetails = "";
    if(counts.zobo > 0) orderDetails += `• *Natural Zobo* (x${counts.zobo})%0A`;
    if(counts.tigernut > 0) orderDetails += `• *Creamy Tigernut* (x${counts.tigernut})%0A`;
    if(counts.smoothie > 0) orderDetails += `• *Fresh Smoothie* (x${counts.smoothie})%0A`;

    const message = `*FRESH SIPS ORDER* 🌿%0A%0A` +
                    `*Customer:* ${name}%0A%0A` +
                    `*Items:*%0A${orderDetails}%0A` +
                    `*Subtotal:* ${subtotalEl.innerText}%0A` +
                    `*Delivery (${locName}):* ${deliveryEl.innerText}%0A` +
                    `*GRAND TOTAL:* ${grandTotalEl.innerText}%0A%0A` +
                    `*Address:* ${address}%0A%0A` +
                    `*PAYMENT:* Opay | 9055906883`;

    // Show the payment pop-up
    const overlay = document.getElementById('thankYouOverlay');
    if (overlay) overlay.classList.remove('hidden');

    // Open WhatsApp
    window.open(`https://wa.me/${MY_WHATSAPP}?text=${message}`, '_blank');
});

document.getElementById('closeOverlay').addEventListener('click', () => {
    location.reload(); 
});

// Initialize UI on load
updateUI();
