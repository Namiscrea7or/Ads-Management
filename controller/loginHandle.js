document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    fetch('https://adsmanagement-pdrm.onrender.com/api/auth/login', {
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
            if (data.success === true) {
                localStorage.setItem('accessToken', 'Bearer ' + data.accessToken);
                window.location.href = '/user';
            }
            else {
                alert('Error: ' + data.message);

            }
        })
        .catch(error => {
            alert('Error')
            console.error('Error:', error);
        });
});
