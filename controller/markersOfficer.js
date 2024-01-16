const accessToken = localStorage.getItem('accessToken');
const role = localStorage.getItem('userRole');
const itemsPerPage = 2;
let currentPage = 1;
let markers = []
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
   if (role === 'Cán bộ Phường') {
        showMarkerCBP(accessToken);
    }
    else if (role === 'Cán bộ Quận') {
    }
});

function showMarkerCBP(accessToken) {
    console.log('có vô đay')
    fetch('http://localhost:3030/api/marker/info_cbp', {
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
        markers = response.markerList;
        renderMarkerInfo(markers);
    } else {
        console.log('error');
        console.error('Error from server:', response.message);
    }
}

function handleError(error) {
    console.error('Error fetching user information:', error.message);
}

function renderMarkerInfo(reports) {
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
                <th>Location Type</th>
                <th>Advertisement Type</th>
                <th>Planning Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${reportsToDisplay.map((report, index) => `
                <tr>
                    <td>${report.address}</td>
                    <td>${report.locationType}</td>
                    <td>${report.adType}</td>
                    <td>${report.planningStatus}</td>
                    <td class="button">
                        <button class="edit-button" data-index="${startIndex + index}">Sửa</button>
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
}
function attachEditButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach((editButton) => {
        editButton.addEventListener('click', () => {
            const reportIndex = parseInt(editButton.getAttribute('data-index'), 10);
            showEditForm(markers[reportIndex], reportIndex);
        });
    });
}

function showEditForm(report, index) {
    const editForm = document.querySelector('.edit-form');
    editForm.querySelector('#adType').value = report.adType;
    editForm.querySelector('#locationType').value = report.locationType;
    editForm.querySelector('#planningStatus').value = report.planningStatus;

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
        adType: editForm.querySelector('#adType').value,
        locationType: editForm.querySelector('#locationType').value,
        planningStatus: editForm.querySelector('#planningStatus').value,
        editDate: editForm.querySelector('#editDate').value,
        reason: editForm.querySelector('#reason').value,
    };

    console.log(updatedReport);

    fetch(`http://localhost:3030/api/markerEdit/marker`, {
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
                markers.splice(index, 1);
                location.reload();
            } else {
                console.error('Error deleting report:', response.message);
            }
        })
        .catch(handleError);
}