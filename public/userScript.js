document.addEventListener('DOMContentLoaded', function () {
  const accessToken = localStorage.getItem('accessToken');
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
  const html = `
      <h2>${user.full_name}</h2>
      <p>Email: ${user.email}</p>
      <p>Phone Number: ${user.phone_number}</p>
      <p>Date of Birth: ${user.dob} </p>
      <p>Role: ${user.role} </p>
  `;
  userDetailsElement.innerHTML = html;
}
