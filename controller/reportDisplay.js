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

    if (role === 'Cán bộ Sở') {
        showCBSrp(accessToken);
    }
    else if (role === 'Cán bộ Phường') {
        showCBPrp(accessToken);
    }
    else if (role === 'Cán bộ Quận') {
        showCBQrp(accessToken);
    }
});

function showCBSrp(accessToken) {
    fetch('https://adsmanagement-pdrm.onrender.com/api/report/info', {
        method: 'GET',
        headers: {
            'Authorization': accessToken
        },
    })
        .then(handleResponse)
        .then(handleSuccess)
        .catch(handleError);
}

function showCBPrp(accessToken) {
    fetch('https://adsmanagement-pdrm.onrender.com/api/report/info_cbp', {
        method: 'GET',
        headers: {
            'Authorization': accessToken
        },
    })
        .then(handleResponse)
        .then(handleSuccess)
        .catch(handleError);
}

function showCBQrp(accessToken) {
    fetch('https://adsmanagement-pdrm.onrender.com/api/report/info_cbq', {
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
    console.log(reportsToDisplay)

    const html = `
    <table class="report-table">
        <thead>
            <tr>
                <th>Address</th>
                <th>Report Type</th>
                <th>Reporter Name</th>
                <th>Reporter Email</th>
                <th>Reporter Phone</th>
                <th>Report Content</th>
                <th>Report Processed</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${reportsToDisplay.map((report, index) => `
                <tr>
                    <td>${report.address}</td>
                    <td>${report.reportType}</td>
                    <td>${report.reporterName}</td>
                    <td>${report.reporterEmail}</td>
                    <td>${report.reporterPhone}</td>
                    <td>${report.reportContent}</td>
                    <td>${report.reportProccessed}</td>
                    <td class="button">
                        <button class="edit-button" data-index="${startIndex + index}">Sửa</button>
                        <button class="delete-button" data-index="${startIndex + index}">Xoá</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>
`;

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

    attachEditButtonListeners();
    attachDeleteButtonListeners();
}

function attachEditButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach((editButton) => {
        editButton.addEventListener('click', () => {
            const reportIndex = parseInt(editButton.getAttribute('data-index'), 10);
            showEditForm(reports[reportIndex], reportIndex);
        });
    });
}

function attachDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', () => {
            const reportIndex = parseInt(deleteButton.getAttribute('data-index'), 10);
            const confirmation = confirm('Are you sure you want to delete this report?');
            if (confirmation) {
                console.log('có vô đây');
                console.log('đây là ', reports[reportIndex].reportContent);
                deleteReport(reports[reportIndex].reportContent, reportIndex);
            }
        });
    });
}


function showEditForm(report, index) {
    const editForm = document.querySelector('.edit-form');
    editForm.querySelector('#edit-report-type').value = report.reportType;
    editForm.querySelector('#edit-report-content').value = report.reportContent;

    editForm.style.display = 'block';

    const saveButton = editForm.querySelector('.save-edit');
    saveButton.addEventListener('click', () => {
        saveEditedReport(report, index);
    });
}

function saveEditedReport(report, index) {
    const editForm = document.querySelector('.edit-form');

    const updatedReport = {
        address: report.address,
        reportType: editForm.querySelector('#edit-report-type').value,
        reporterName: report.reporterName,
        reporterEmail: report.reporterEmail,
        reporterPhone: report.reporterPhone,
        reportContent: editForm.querySelector('#edit-report-content').value,
        reportProccessed: editForm.querySelector('#reportProccessed').value
    };

    console.log(updatedReport);

    fetch(`https://adsmanagement-pdrm.onrender.com/api/report/update_report`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
        },
        body: JSON.stringify(updatedReport),
    })
        .then(handleResponse)
        .then((response) => {
            if (response.success) {
                reports.splice(index, 1);
                location.reload();
            } else {
                console.error('Error deleting report:', response.message);
            }
        })
        .catch(handleError);
}

function deleteReport(reportContent, index) {
    console.log('có đi vô hàm này')
    if (!reports || !Array.isArray(reports) || reports.length === 0) {
        console.error('Error: Reports array is not properly initialized.');
        return;
    }
    fetch(`https://adsmanagement-pdrm.onrender.com/api/report/${reportContent}`, {
        method: 'DELETE',
        headers: {
            'Authorization': accessToken,
        },
    })
        .then(handleResponse)
        .then((response) => {
            if (response.success) {
                reports.splice(index, 1);
                location.reload();
            } else {
                console.error('Error deleting report:', response.message);
            }
        })
        .catch(handleError);
}

