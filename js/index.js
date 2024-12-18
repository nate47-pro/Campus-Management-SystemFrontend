const form = document.getElementById('loginForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    
    // console.log(`email: ${email}, password: ${password}`);
    fetch('https://campus-management-systembackend.onrender.com/api/v2/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else if(data.user.role === "admin") {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'admin.html';
        }else{
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'user_dashboard.html';
        }
    });
});