window.submitBBForm = function () {
  var accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.error('Access token not available');
    return;
  }
  var userRole = localStorage.getItem('userRole');
  // var imageInput = document.getElementById('image');
  // var image = imageInput.files[0];
  if(userRole === 'Cán bộ Sở') {
    var locationData = {
      address: document.getElementById('reportedBBAddress').value,
      type: document.getElementById('bbType').value,
      size: document.getElementById('bbSize').value,
      date: document.getElementById('bbDate').value,
      isActivated: true
    };
  
    console.log('Billboard: ', locationData)
  
    fetch('https://adsmanagement-pdrm.onrender.com/api/billboard/billboard', {
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
      address: document.getElementById('reportedBBAddress').value,
      type: document.getElementById('bbType').value,
      size: document.getElementById('bbSize').value,
      date: document.getElementById('bbDate').value,
      isActivated: false
    };
  
    console.log('Billboard: ', locationData)
  
    fetch('https://adsmanagement-pdrm.onrender.com/api/billboard/billboard', {
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