const accessToken = localStorage.getItem('accessToken');
const role = localStorage.getItem('userRole');
const itemsPerPage = 2;
let currentPage = 1;
let reports = [];




document.getElementById('pagination').addEventListener('click', (event) => {
    if (event.target.id === 'prev-page' && currentPage > 1) {
        currentPage--;
        renderReportInfo(reports);
    } else if (event.target.classList.contains('page-number')) {
        currentPage = parseInt(event.target.textContent, 10);
        renderReportInfo(reports);
    } else if (event.target.id === 'next-page') {
        const totalPages = Math.ceil(reports.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderReportInfo(reports);
        }
    }
});

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
        reports = response.reports;
        renderReportInfo(reports);
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
    const paginationElement = document.getElementById('pagination');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const reportsToDisplay = reports.slice(startIndex, endIndex);

    const html = reportsToDisplay.map(report => `
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

    const prevPageButton = paginationElement.querySelector('#prev-page');
    const nextPageButton = paginationElement.querySelector('#next-page');
    const pageNumbersContainer = paginationElement.querySelector('.page-numbers');

    prevPageButton.style.display = currentPage > 1 ? 'inline-block' : 'none';
    nextPageButton.style.display = currentPage < Math.ceil(reports.length / itemsPerPage) ? 'inline-block' : 'none';

    const totalPages = Math.ceil(reports.length / itemsPerPage);
    const paginationHtml = Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return `<span class="page-number ${pageNumber === currentPage ? 'active' : ''}">${pageNumber}</span>`;
    }).join('');

    pageNumbersContainer.innerHTML = paginationHtml;

    contentContainer.style.display = 'block';
}
