// Variable to store selected slot
let selectedSlot = '';
let selectedLocation = ''; 
let selectedServices = []; 
let registeredUsername = ''; 
let registeredEmail = ''; 

//  slot selection
document.querySelectorAll('.slot-item').forEach(item => {
    item.addEventListener('click', function () {
        selectedSlot = this.textContent; 
        
        document.querySelectorAll('.slot-item').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// invoice
document.getElementById('proceedToInvoice').addEventListener('click', function () {
    document.getElementById('services').style.display = 'none';
    document.getElementById('payment').style.display = 'block';
});

//  registration
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    }).then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            registeredUsername = username; 
            registeredEmail = email; 
            document.getElementById('registration').style.display = 'none';
            document.getElementById('login').style.display = 'block';
        }
    });
});

// Handle user login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const loginUser = document.getElementById('loginUser').value;
    const loginPass = document.getElementById('loginPass').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginUser, loginPass })
    }).then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('locationSelection').style.display = 'block';
        }
    });
});

// Handle navigation to the login form from the registration form
document.getElementById('goToLogin').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'block';
});

// Handle location selection
document.getElementById('selectLocation').addEventListener('click', function () {
    selectedLocation = document.getElementById('locations').value; // Store selected location
    document.getElementById('locationSelection').style.display = 'none';
    document.getElementById('slotSelection').style.display = 'block';
});

// Hslot selection and show services
document.getElementById('payNow').addEventListener('click', function () {
    document.getElementById('slotSelection').style.display = 'none';
    document.getElementById('services').style.display = 'block';
});

// Add selected services to the list
function addService(service) {
    if (!selectedServices.includes(service)) {
        selectedServices.push(service);
        alert(`${service} added.`);
    }
}

//  services
document.getElementById('carWash').addEventListener('change', function () {
    if (this.checked) {
        addService('Car Wash');
    } else {
        selectedServices = selectedServices.filter(service => service !== 'Car Wash');
    }
});

document.querySelectorAll('#foodMenu input[type="checkbox"]').forEach(item => {
    item.addEventListener('change', function () {
        const value = this.value;
        if (this.checked) {
            addService(value);
        } else {
            selectedServices = selectedServices.filter(service => service !== value);
        }
    });
});

document.getElementById('garage').addEventListener('change', function () {
    if (this.checked) {
        addService('Garage Service');
    } else {
        selectedServices = selectedServices.filter(service => service !== 'Garage Service');
    }
});

// Handle payment selection
document.getElementById('upi').addEventListener('click', function () {
    completePayment('UPI');
});

document.getElementById('cash').addEventListener('click', function () {
    completePayment('Cash');
});

// invoice
function completePayment(method) {
    fetch('/pay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ method, services: selectedServices })
    }).then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('payment').style.display = 'none';
            document.getElementById('invoice').style.display = 'block';
            document.getElementById('invoiceLocation').textContent = selectedLocation;
            document.getElementById('invoiceSlot').textContent = selectedSlot;
            document.getElementById('invoiceHours').textContent = '2 hours'; 
            document.getElementById('invoiceUsername').textContent = registeredUsername;
            document.getElementById('invoiceEmail').textContent = registeredEmail; 
            document.getElementById('invoiceDateTime').textContent = new Date().toLocaleString();
            document.getElementById('invoiceMethod').textContent = method;
            document.getElementById('invoiceServices').textContent = selectedServices.join(', ');
            document.getElementById('invoiceTotalAmount').textContent = calculateTotal(); 
        }
    });
}

// calculate total amount 
function calculateTotal() {
    let total = 0;
   

    if (selectedServices.includes('Car Wash')) total += 1000;
    selectedServices.forEach(service => {
        if (service.includes('Burger')) total += 500;
        else if (service.includes('Pizza')) total += 800;
        else if (service.includes('Coffee')) total += 300;
        else if (service.includes('Garage Service')) total += 4000;
    });

    return total;
}
