document.addEventListener("DOMContentLoaded", async () => {
    const seatElements = document.querySelectorAll('.seat');

    // Fetch already booked seats from server
    try {
        const response = await fetch('http://bookmyticket-backend-cg1z.onrender.com/api/seats');
        const bookedSeats = await response.json();

        seatElements.forEach(seat => {
            const seatNumber = seat.getAttribute('data-seat');

            if (bookedSeats.includes(seatNumber)) {
                seat.classList.add('booked');
            } else {
                seat.addEventListener('click', () => {
                    seat.classList.toggle('selected');
                });
            }
        });
    } catch (error) {
        console.error('Error fetching booked seats:', error);
    }

    document.getElementById('proceedBtn').addEventListener('click', async () => {
        const selected = Array.from(document.querySelectorAll('.seat.selected')).map(seat => seat.getAttribute('data-seat'));

        if (selected.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        const data = {
            user: "GuestUser",
            bookedSeats: selected,
            movie: "Example Movie",
            showtime: "7:00 PM"
        };

        try {
            const res = await fetch('http://bookmyticket-backend-cg1z.onrender.com/api/seats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            alert(result.message);
            window.location.reload(); // Reload to update seat status
        } catch (error) {
            console.error('Error booking seats:', error);
            alert("Booking failed. Try again.");
        }
    });
});
