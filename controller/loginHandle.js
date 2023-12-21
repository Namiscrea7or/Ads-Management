document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    fetch('http://localhost:3030/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then(response => response.json()) 
    .then(data => {
        console.log('Success:', data);
        localStorage.setItem('accessToken', 'Bearer ' + data.accessToken);
        window.location.href = '/';
    })
    .catch(error => {
        alert('Error')
        console.error('Error:', error);
    });
});
