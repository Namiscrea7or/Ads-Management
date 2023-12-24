window.submitForm = function () {
  var accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.error('Access token not available');
    return;
  }
  // var imageInput = document.getElementById('image');
  // var image = imageInput.files[0];
  var locationData = {
    adType: document.getElementById('adType').value,
    locationType: document.getElementById('locationType').value,
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
    address: document.getElementById('reportedAddress').value,
    ward: document.getElementById('reportedWard').value,
    district: document.getElementById('reportedDistrict').value,
    planningStatus: document.getElementById('planningStatus').value,

  };

  console.log(locationData)

  fetch('http://localhost:3030/api/marker/marker', {
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