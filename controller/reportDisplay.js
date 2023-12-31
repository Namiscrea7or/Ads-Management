const accessToken = localStorage.getItem('accessToken');
const role = localStorage.getItem('userRole');
document.addEventListener('DOMContentLoaded', function () {
    console.log('Access Token:', accessToken);

    if (!accessToken) {
        console.error('Access token not found in localStorage.');
        return;
    }
    if (role === 'Cán bộ Sở')
        fetchUserInfo(accessToken);
});

function fetchUserInfo(accessToken) {
    fetch('http://localhost:3030/api/report/info', {
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
        renderReportInfo(response.reports);
    } else {
        console.log('error');
        console.error('Error from server:', response.message);
    }
}

function handleError(error) {
    console.error('Error fetching user information:', error.message);

}

function renderReportInfo(reports) {
    const contentContainer = document.getElementById('content-container');
    const userDetailsElement = document.getElementById('user-details');
    const additionalActionsElement = document.getElementById('additional-actions');

    const html = reports.map(report => `
        <div class="report-item">
            <div>
                <p><strong>Address:</strong> ${report.address}</p>
                <p><strong>Report Type:</strong> ${report.reportType}</p>
                <p><strong>Reporter Name:</strong> ${report.reporterName}</p>
                <p><strong>Reporter Email:</strong> ${report.reporterEmail}</p>
                <p><strong>Reporter Phone:</strong> ${report.reporterPhone}</p>
                <p><strong>Report Content:</strong> ${report.reportContent}</p>
            </div>
            <div class="button">
                <button class="edit-button">Sửa</button>
                <button class="delete-button">Xoá</button>
            </div>
        </div>
    `).join('');

    userDetailsElement.innerHTML = html;
    contentContainer.style.display = 'block'; // Display the content container
    // Additional actions code remains the same
}