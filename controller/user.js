// user.js

document.addEventListener('DOMContentLoaded', function () {
    const userContent = document.getElementById('userContent');
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        fetch('http://localhost:3030/api/user/info', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            // Hiển thị dữ liệu từ máy chủ trên trang
            userContent.innerHTML = `<p>${data.message}</p>`;
        })
        .catch(error => {
            console.error('Error:', error);
            userContent.innerHTML = '<p>Error fetching data from the server</p>';
        });
    } else {
        // Người dùng chưa đăng nhập, hiển thị thông báo hoặc chuyển hướng đến trang đăng nhập
        userContent.innerHTML = '<p>You are not logged in. Please <a href="/login">login</a>.</p>';
    }
});
