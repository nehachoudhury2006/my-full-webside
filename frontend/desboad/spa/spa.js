// Screens inside the booking section
const page1 = document.getElementById('page-1');
const page2 = document.getElementById('page-2');
const page3 = document.getElementById('page-3');

// Elements
const selectedServiceName = document.getElementById('selected-service-name');
const displayName = document.getElementById('display-name');
const guestNameInput = document.getElementById('guestName');
const bookingForm = document.getElementById('booking-form');
const bookingDateInput = document.getElementById('bookingDate');
const bookingTimeInput = document.getElementById('bookingTime');
const bookingPeopleInput = document.getElementById('bookingPeople');

// Function: Move to Form
function goToPage2(serviceName) {
    selectedServiceName.innerText = serviceName;
    page1.classList.remove('active-screen');
    page2.classList.add('active-screen');
    
    // Smooth scroll to the form
    document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
}

// Function: Go back to Menu
function goBackToPage1() {
    page2.classList.remove('active-screen');
    page1.classList.add('active-screen');
}

// Function: Submit and see Upsell
bookingForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    let name = guestNameInput.value.trim();
    const user = LuxuryHub.getCurrentUser();
    const email = user?.email || LuxuryHub.readSession()?.email || "";
    if (name === "") name = LuxuryHub.readSession()?.name || "Guest";

    try {
        await LuxuryHub.submitAppointment({
            userName: name,
            email,
            category: 'spa',
            service: selectedServiceName.innerText,
            bookingType: 'wellness',
            date: bookingDateInput.value,
            time: bookingTimeInput.value,
            numberOfPeople: Number(bookingPeopleInput.value) || 1,
            notes: 'Spa reservation confirmed. Arrival recommended 10 minutes early.',
            amount: 180 * (Number(bookingPeopleInput.value) || 1),
            returnPath: 'spa/spa.html'
        });

        displayName.innerText = name;
        page2.classList.remove('active-screen');
        page3.classList.add('active-screen');
        setTimeout(() => {
            window.location.href = '../thank-you.html';
        }, 600);
    } catch (error) {
        console.error(error);
        alert(error.message || 'Unable to save booking');
    }
});

// Function: Add facilities
function addFacility(buttonElement) {
    buttonElement.innerText = "Added ✓";
    buttonElement.style.backgroundColor = "#8A9A86"; 
    buttonElement.style.color = "#FFFFFF";
    buttonElement.style.borderColor = "#8A9A86";
}

// Function: Finish and reset
function finishFlow() {
    // Reset back to screen 1
    page3.classList.remove('active-screen');
    page1.classList.add('active-screen');
    bookingForm.reset();
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
