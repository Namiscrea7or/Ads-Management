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
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        // Log the success response data to the console
        console.log('Success:', data);
    })
    .catch(error => {
        // Log any errors that occur during the fetch or JSON parsing process
        console.error('Error:', error);
    });
});
