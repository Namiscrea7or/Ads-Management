window.submitForm = function () {
  var accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.error('Access token not available');
    return;
  }
  // var imageInput = document.getElementById('image');
  // var image = imageInput.files[0];
  
  var userRole = localStorage.getItem('userRole');
  if(userRole === 'Cán bộ Sở') {
    var locationData = {
      adType: document.getElementById('adType').value,
      locationType: document.getElementById('locationType').value,
      latitude: document.getElementById('latitude').value,
      longitude: document.getElementById('longitude').value,
      address: document.getElementById('reportedAddress').value,
      planningStatus: document.getElementById('planningStatus').value,
      isActivated: true
    };
  
    console.log(locationData)
  
    fetch('https://adsmanagement-pdrm.onrender.com/api/marker/marker', {
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
        location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Fail');
      });
  }
  else if(userRole === 'Cán bộ Phường' || userRole === 'Cán bộ Quận') {
    var locationData = {
      adType: document.getElementById('adType').value,
      locationType: document.getElementById('locationType').value,
      latitude: document.getElementById('latitude').value,
      longitude: document.getElementById('longitude').value,
      address: document.getElementById('reportedAddress').value,
      planningStatus: document.getElementById('planningStatus').value,
      isActivated: false
    };
  
    console.log(locationData)
  
    fetch('https://adsmanagement-pdrm.onrender.com/api/marker/marker', {
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
        location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Fail');
      });
  }
  
};