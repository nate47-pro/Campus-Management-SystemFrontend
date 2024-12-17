const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let preferences = document.getElementById('preferences').value;

    console.log(username, email, password, confirmPassword, preferences);

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    fetch('https://campus-management-systembackend.onrender.com/api/v2/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, preferences, role: 'user' })
    })
    .then(response => response.json())
    .then(data => {
        if(data.message === "User registered successfully"){
            alert(data.message);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'user_dashboard.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    });
});