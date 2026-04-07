document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.getElementById('closeModal');
    const bookBtns = document.querySelectorAll('.select-btn');
    const bookingForm = document.getElementById('bookingForm');
    const hairDate = document.getElementById('hairDate');
    const hairTime = document.getElementById('hairTime');
    const hairPeople = document.getElementById('hairPeople');
    
    // Dynamic text elements inside Modal
    const modalStyleName = document.getElementById('modalStyleName');
    const modalPriceTag = document.getElementById('modalPriceTag');

    // 1. Open Modal when a button is clicked
    bookBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            // Find the specific card we clicked on
            const card = event.target.closest('.style-card');
            
            // Get Name and Price from that card
            const styleName = card.querySelector('.style-name').innerText;
            const price = card.querySelector('.price-overlay').innerText;

            // Put them into the popup
            modalStyleName.innerText = styleName;
            modalPriceTag.innerText = price;

            // Show Popup
            modal.classList.add('active');
        });
    });

    // 2. Close Modal (X Button)
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // 3. Close Modal (Clicking Outside)
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = LuxuryHub.getCurrentUser();
        const guestName = user?.fullname || LuxuryHub.readSession()?.name || "Guest";

        try {
            await LuxuryHub.submitAppointment({
                userName: guestName,
                email: user?.email || LuxuryHub.readSession()?.email || "",
                category: 'salon-hair',
                service: modalStyleName.innerText,
                bookingType: 'salon',
                date: hairDate.value,
                time: hairTime.value,
                numberOfPeople: Number(hairPeople.value) || 1,
                notes: `Style selection: ${modalPriceTag.innerText}.`,
                amount: Number((modalPriceTag.innerText || "").replace(/[^0-9.]/g, "")) * (Number(hairPeople.value) || 1),
                returnPath: 'selon/hair.html'
            });

            modal.classList.remove('active');
            bookingForm.reset();
            window.location.href = '../thank-you.html';
        } catch (error) {
            console.error(error);
            alert(error.message || 'Unable to save booking');
        }
    });
});
