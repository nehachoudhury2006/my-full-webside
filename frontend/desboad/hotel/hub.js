// Grab the main elements
const body = document.getElementById('body');
const mainMenu = document.getElementById('main-menu');
const hotelSection = document.getElementById('hotel-section');
const foodSection = document.getElementById('food-section');
const topNav = document.getElementById('topNav');

// 1. Open Hotel Function
function openHotel() {
    mainMenu.style.display = 'none';
    foodSection.style.display = 'none';
    
    hotelSection.style.display = 'block';
    topNav.style.display = 'flex';
    
    // Change Background to Blue/Gold Theme
    body.className = 'theme-hotel';
}

// 2. Open Food Function
function openFood() {
    mainMenu.style.display = 'none';
    hotelSection.style.display = 'none';
    
    foodSection.style.display = 'block';
    topNav.style.display = 'flex';
    
    // Change Background to Warm Food Theme
    body.className = 'theme-food';
}

// 3. Go Back Home Function
function goHome() {
    hotelSection.style.display = 'none';
    foodSection.style.display = 'none';
    
    mainMenu.style.display = 'flex';
    topNav.style.display = 'none';
    
    // Return to Mixed Color Aesthetic Theme
    body.className = 'theme-main';
}

// 4. Switch Between Breakfast and Lunch
function showMeal(mealId, btnElement) {
    // Hide all menus
    document.querySelectorAll('.menu-category').forEach(menu => {
        menu.classList.remove('active');
    });
    
    // Show the clicked one
    document.getElementById(mealId).classList.add('active');

    // Remove active styling from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active styling to the button you just clicked
    btnElement.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const user = LuxuryHub.getCurrentUser();

    document.querySelectorAll('.book-room-btn').forEach((button) => {
        button.addEventListener('click', async () => {
            const roomName = button.dataset.roomName;
            const roomPrice = Number(button.dataset.roomPrice || 0);

            try {
                await LuxuryHub.submitAppointment({
                    userName: user?.fullname || LuxuryHub.readSession()?.name || 'Guest',
                    email: user?.email || LuxuryHub.readSession()?.email || '',
                    category: 'hotel-room',
                    service: roomName,
                    bookingType: 'room',
                    date: new Date().toISOString().slice(0, 10),
                    time: '15:00',
                    numberOfPeople: 1,
                    notes: 'Room reservation added to your booking cart.',
                    amount: roomPrice,
                    returnPath: 'hotel/hotel.html'
                });
                alert(`${roomName} added to your booking cart.`);
            } catch (error) {
                console.error(error);
                alert(error.message || 'Unable to save room booking');
            }
        });
    });

    document.querySelectorAll('.food-order-btn').forEach((button) => {
        button.addEventListener('click', async () => {
            const foodName = button.dataset.foodName;
            const foodPrice = Number(button.dataset.foodPrice || 0);

            try {
                await LuxuryHub.submitAppointment({
                    userName: user?.fullname || LuxuryHub.readSession()?.name || 'Guest',
                    email: user?.email || LuxuryHub.readSession()?.email || '',
                    category: 'dining',
                    service: foodName,
                    bookingType: 'dining',
                    date: new Date().toISOString().slice(0, 10),
                    time: '20:00',
                    numberOfPeople: 1,
                    notes: 'Dining order added to your booking cart.',
                    amount: foodPrice,
                    returnPath: 'hotel/hotel.html'
                });
                alert(`${foodName} added to your booking cart.`);
            } catch (error) {
                console.error(error);
                alert(error.message || 'Unable to save dining booking');
            }
        });
    });
});
