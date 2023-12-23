
document.addEventListener('DOMContentLoaded', function () {
  var adsCheckForm = document.getElementById('adsCheck');

  if (adsCheckForm) {
    adsCheckForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleAdsCheckForm();
    });
  } else {
    console.error('Form not found');
  }
});

function handleAdsCheckForm() {
  var accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.error('Access token not available');
    return;
  }

  var formData = {
    adType: document.getElementById('adType').value,
    locationType: document.getElementById('locationType').value,
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
    reportedAddress: document.getElementById('reportedAddress').value,
    reportedWard: document.getElementById('reportedWard').value,
    reportedDistrict: document.getElementById('reportedDistrict').value,
  };

  fetch('http://localhost:3030/api/marker/marker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify(formData),
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
}
