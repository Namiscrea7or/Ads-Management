const accessToken = localStorage.getItem('accessToken');
document.addEventListener('DOMContentLoaded', function () {
  console.log('Access Token:', accessToken);

  if (!accessToken) {
    console.error('Access token not found in localStorage.');
    return;
  }

  fetchUserInfo(accessToken);
});

function fetchUserInfo(accessToken) {
  fetch('http://localhost:3030/api/user/info', {
    method: 'GET',
    headers: {
      'Authorization': accessToken
    },
  })
    .then(handleResponse)
    .then(handleSuccess)
    .catch(handleError);
}

function handleResponse(response) {
  if (!response.ok) {
    console.error(`HTTP error! Status: ${response.status}`);
    return response.text().then(html => {
      console.error('HTML Content:', html);
      throw new Error('Non-JSON response received.');
    });
  }
  return response.json();
}

function handleSuccess(response) {
  if (response.success) {
    console.log(response);
    renderUserInfo(response.user);
    localStorage.setItem('userRole', response.user.role);
  } else {
    console.log('error');
    console.error('Error from server:', response.error);
  }
}

function handleError(error) {
  console.error('Error fetching user information:', error.message);
}

function renderUserInfo(user) {
  const userDetailsElement = document.getElementById('user-details');
  const additionalActionsElement = document.getElementById('additional-actions');

  const html = `
    <h2>${user.full_name}</h2>
    <p>Email: ${user.email}</p>
    <p>Phone Number: ${user.phone_number}</p>
    <p>Date of Birth: ${user.dob} </p>
    <p>Role: ${user.role} </p>
  `;
  userDetailsElement.innerHTML = html;

  if (user.role === 'Cán bộ Sở') {
    const additionalActionsHtml = `
      <button id="createDistrictOfficerBtn">Tạo cán bộ phường</button>
      <button id="createWardOfficerBtn">Tạo cán bộ quận</button>
    `;
    additionalActionsElement.innerHTML = additionalActionsHtml;

    document.getElementById('createDistrictOfficerBtn').addEventListener('click', () => showCreateAccountForm('Cán bộ Phường'));
    document.getElementById('createWardOfficerBtn').addEventListener('click', () => showCreateAccountForm('Cán bộ Quận'));
  }
}

function showCreateAccountForm(role) {
  const formHtml = `
    <form id="createAccountForm">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>

      <label for="full_name">Full Name:</label>
      <input type="text" id="full_name" name="full_name" required>

      <label for="phone_number">Phone Number:</label>
      <input type="tel" id="phone_number" name="phone_number" required>

      <label for="dob">Date of Birth:</label>
      <input type="date" id="dob" name="dob" required>

      <label for="role">Role:</label>
      <input type="text" id="role" name="role" value="${role}" disabled>

      <input type="submit" value="Submit">
    </form>
  `;

  const formContainer = document.getElementById('form-container');
  formContainer.innerHTML = formHtml;

  document.getElementById('createAccountForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append('role', role);

    fetch('http://localhost:3030/api/auth/register_CB', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
        full_name: formData.get('full_name'),
        phone_number: formData.get('phone_number'),
        dob: formData.get('dob'),
        role: formData.get('role'), 
      }),
    })
      .then(handleResponse)
      .then(handleCreateAccountSuccess)
      .catch(handleError);
  });
}

function handleCreateAccountSuccess(response) {
  if (response.success) {
    console.log('Account creation successful:', response);
    alert('Tạo thành công');
  } else {
    alert('Tạo thất bại')
    console.error('Error creating account:', response.error);
  }
}

function createDistrictOfficerAccount() {
  console.log('Creating District Officer Account');
}

function createWardOfficerAccount() {
  console.log('Creating Ward Officer Account');
}
