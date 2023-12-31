const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const dob = document.getElementById('registerDob').value;
    const phoneNumber = document.getElementById('registerPhoneNumber').value;

    fetch('http://localhost:3030/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: name,
        email: email,
        password: password,
        dob: dob,
        phone_number: phoneNumber,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        localStorage.setItem('accessToken', 'Bearer ' + data.accessToken);
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error')
      });
  });
} else {
  console.error('registerForm is null or undefined.');
}
