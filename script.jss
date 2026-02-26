const prices = { zobo: 500, tigernut: 700, smoothie: 1000 };
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
        document.getElementById(`qty-${key}`).innerText = counts[key];
    }
    const deliveryFee = parseInt(locationSelect.value);
    const total = subtotal + deliveryFee;
    subtotalEl.innerText = `₦${subtotal.toLocaleString()}`;
    deliveryEl.innerText = `₦${deliveryFee.toLocaleString()}`;
    grandTotalEl.innerText = `₦${total.toLocaleString()}`;
    popTotal.innerText = `₦${total.toLocaleString()}`;
}

document.querySelectorAll('.btn-qty').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        btn.classList.contains('plus') ? counts[type]++ : (counts[type] > 0 ? counts[type]-- : null);
        updateUI();
    });
});

locationSelect.addEventListener('change', updateUI);

document.getElementById('copyBtn').addEventListener('click', function() {
    navigator.clipboard.writeText("9055906883").then(() => {
        this.innerText = "Copied!";
        setTimeout(() => this.innerText = "Copy", 2000);
    });
});

document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const hasItems = Object.values(counts).some(c => c > 0);
    if (!hasItems) return alert("Please select a drink first!");

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const locName = locationSelect.options[locationSelect.selectedIndex].text;
    
    let orderDetails = "";
    if(counts.zobo > 0) orderDetails += `*Zobo:* ${counts.zobo}%0A`;
    if(counts.tigernut > 0) orderDetails += `*Tigernut:* ${counts.tigernut}%0A`;
    if(counts.smoothie > 0) orderDetails += `*Smoothie:* ${counts.smoothie}%0A`;

    const message = `*FRESH SIPS ORDER* 🌿%0A%0A` +
                    `*Customer:* ${name}%0A` +
                    `*Order:*%0A${orderDetails}%0A` +
                    `*Total:* ${grandTotalEl.innerText}%0A` +
                    `*Location:* ${locName}%0A` +
                    `*Address:* ${address}%0A%0A` +
                    `*PAYMENT:* Opay | 9055906883`;

    // 1. Show the pop-up for account details
    document.getElementById('thankYouOverlay').classList.remove('hidden');

    // 2. OPEN WHATSAPP IMMEDIATELY (No timer)
    window.open(`https://wa.me/${MY_WHATSAPP}?text=${message}`, '_blank');
});

document.getElementById('closeOverlay').addEventListener('click', () => {
    location.reload(); 
});

updateUI();
