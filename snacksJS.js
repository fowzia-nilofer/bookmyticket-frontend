// document.addEventListener("DOMContentLoaded", function () {
//   const increaseButtons = document.querySelectorAll(".increase");
//   const decreaseButtons = document.querySelectorAll(".decrease");
//   const quantities = document.querySelectorAll(".quantity");
//   const totalAmount = document.getElementById("totalAmount");
//   const snackItems = document.querySelectorAll(".snack-item");

//   function calculateTotal() {
//       let total = 0;
//       snackItems.forEach((item, index) => {
//           const price = parseInt(item.dataset.price);
//           const quantity = parseInt(quantities[index].textContent);
//           total += price * quantity;
//       });
//       totalAmount.textContent = total;
//       localStorage.setItem("snackTotal", total);
//   }

//   increaseButtons.forEach((btn, index) => {
//       btn.addEventListener("click", () => {
//           let qty = parseInt(quantities[index].textContent);
//           quantities[index].textContent = qty + 1;
//           calculateTotal();
//       });
//   });

//   decreaseButtons.forEach((btn, index) => {
//       btn.addEventListener("click", () => {
//           let qty = parseInt(quantities[index].textContent);
//           if (qty > 0) {
//               quantities[index].textContent = qty - 1;
//               calculateTotal();
//           }
//       });
//   });
// });

// function placeSnackOrder() {
//   const snackItems = document.querySelectorAll(".snack-item");
//   const quantities = document.querySelectorAll(".quantity");
//   let order = [];

//   snackItems.forEach((item, index) => {
//       let quantity = parseInt(quantities[index].textContent);
//       if (quantity > 0) {
//           order.push(`${item.dataset.name} x${quantity}`);
//       }
//   });

//   if (order.length === 0) {
//       alert("Please select at least one snack.");
//       return;
//   }

//   const totalAmount = parseInt(document.getElementById("totalAmount").textContent);
//   const user = "GuestUser";  // Replace with real user logic later

//   fetch('http://localhost:5000/api/snacks', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//           user: user,
//           snacks: order,
//           totalPrice: totalAmount
//       })
//   })
//   .then(res => res.json())
//   .then(data => {
//       alert(data.message);
//       window.location.href = "billing.html";
//   })
//   .catch(err => {
//       console.error("Error:", err);
//       alert("Failed to place snack order.");
//   });
// }
// document.querySelector('.done-btn').addEventListener('click', function() {
//   const quantities = Array.from(document.querySelectorAll('.quantity')).map(q => parseInt(q.textContent));
//   const snackNames = ["Popcorn", "Veg Burger", "French Fries", "Donuts", "Cake", "Coke"];
//   const orderedSnacks = [];

//   quantities.forEach((qty, index) => {
//       if (qty > 0) {
//           orderedSnacks.push(`${snackNames[index]} x${qty}`);
//       }
//   });

//   const totalAmount = parseInt(document.getElementById('totalAmount').textContent);

//   fetch('http://localhost:5000/api/snacks', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//           user: 'GuestUser',
//           snacks: orderedSnacks,
//           totalPrice: totalAmount
//       })
//   })
//   .then(response => response.json())
//   .then(data => {
//       alert(data.message);
//       window.location.href = "billing.html";  // Redirect if successful
//   })
//   .catch(error => {
//       console.error('Error:', error);
//       alert('Order failed!');
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
    const increaseButtons = document.querySelectorAll(".increase");
    const decreaseButtons = document.querySelectorAll(".decrease");
    const quantities = document.querySelectorAll(".quantity");
    const totalAmount = document.getElementById("totalAmount");
    const snackItems = document.querySelectorAll(".snack-item");
    
    // Load any previously selected quantities if coming back to this page
    const loadPreviousSelections = () => {
        // Only if we have stored selections
        const savedSelections = localStorage.getItem("tempSnackSelections");
        if (savedSelections) {
            const selections = JSON.parse(savedSelections);
            selections.forEach((qty, index) => {
                if (index < quantities.length) {
                    quantities[index].textContent = qty;
                }
            });
            calculateTotal(false); // Calculate but don't save to localStorage yet
        }
    };
    
    function calculateTotal(saveToStorage = false) {
        let total = 0;
        snackItems.forEach((item, index) => {
            const price = parseInt(item.dataset.price);
            const quantity = parseInt(quantities[index].textContent);
            total += price * quantity;
        });
        totalAmount.textContent = total;
        
        // Only save to localStorage when explicitly instructed
        if (saveToStorage) {
            localStorage.setItem("snackTotal", total);
        }
        
        // Temporarily store the selections for later use
        const currentSelections = Array.from(quantities).map(q => parseInt(q.textContent));
        localStorage.setItem("tempSnackSelections", JSON.stringify(currentSelections));
    }
    
    increaseButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            let qty = parseInt(quantities[index].textContent);
            quantities[index].textContent = qty + 1;
            calculateTotal(false); // Don't save to localStorage yet
        });
    });
    
    decreaseButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            let qty = parseInt(quantities[index].textContent);
            if (qty > 0) {
                quantities[index].textContent = qty - 1;
                calculateTotal(false); // Don't save to localStorage yet
            }
        });
    });
    
    // Add event listener to cancel button
    document.querySelector('.cancel-btn').addEventListener('click', function() {
        // Clear temporary selections and snack total
        localStorage.removeItem("tempSnackSelections");
        localStorage.removeItem("snackTotal");
    });
    
    // Load any previous selections
    loadPreviousSelections();
    
    // Initial calculation without saving
    calculateTotal(false);
});

function placeSnackOrder() {
    const snackItems = document.querySelectorAll(".snack-item");
    const quantities = document.querySelectorAll(".quantity");
    let order = [];
    snackItems.forEach((item, index) => {
        let quantity = parseInt(quantities[index].textContent);
        if (quantity > 0) {
            order.push(`${item.dataset.name} x${quantity}`);
        }
    });
    
    if (order.length === 0) {
        alert("Please select at least one snack.");
        return;
    }
    
    const totalAmount = parseInt(document.getElementById("totalAmount").textContent);
    
    // NOW we save the final total to localStorage
    localStorage.setItem("snackTotal", totalAmount);
    
    const user = "GuestUser"; // Replace with real user logic later
    fetch('http://bookmyticket-backend-cg1z.onrender.com/api/snacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user: user,
            snacks: order,
            totalPrice: totalAmount
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        localStorage.removeItem("tempSnackSelections"); // Clean up temp data
        window.location.href = "billing.html";
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Failed to place snack order.");
    });
}   
