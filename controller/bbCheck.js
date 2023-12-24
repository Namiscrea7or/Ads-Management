window.submitBBForm = function () {
  var accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.error('Access token not available');
    return;
  }
  // var imageInput = document.getElementById('image');
  // var image = imageInput.files[0];
  var locationData = {
    address: document.getElementById('reportedBBAddress').value,
    type: document.getElementById('bbType').value,
    size: document.getElementById('bbSize').value,
    date: document.getElementById('bbDate').value
  };

  console.log('Billboard: ', locationData)

  fetch('http://localhost:3030/api/billboard/billboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify(locationData)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert('Success');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Fail');
    });
};