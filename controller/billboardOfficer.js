const accessToken = localStorage.getItem('accessToken');
const role = localStorage.getItem('userRole');
const itemsPerPage = 2;
let currentPage = 1;
let markers = []
document.getElementById('pagination').addEventListener('click', (event) => {
    if (event.target.id === 'prev-page' && currentPage > 1) {
        currentPage--;
        renderMarkerInfo(markers);
    } else if (event.target.classList.contains('page-number')) {
        currentPage = parseInt(event.target.textContent, 10);
        renderMarkerInfo(markers);
    } else if (event.target.id === 'next-page') {
        const totalPages = Math.ceil(markers.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderMarkerInfo(markers);
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
        showMarkerCBQ(accessToken)
    }
    else if (role === 'Cán bộ Sở') {
        showMarkerCBS(accessToken)
    }
});

function showMarkerCBP(accessToken) {
    fetch('http://localhost:3030/api/billboard/info_cbp', {
        method: 'GET',
        headers: {
            'Authorization': accessToken
        },
    })
        .then(handleResponse)
        .then(handleSuccess)
        .catch(handleError);
}

function showMarkerCBQ(accessToken) {
    fetch('http://localhost:3030/api/billboard/info_cbq', {
        method: 'GET',
        headers: {
            'Authorization': accessToken
        },
    })
        .then(handleResponse)
        .then(handleSuccess)
        .catch(handleError);
}

function showMarkerCBS(accessToken) {
    fetch('http://localhost:3030/api/billboardEdit/info', {
        method: 'GET',
        headers: {
            'Authorization': accessToken
        },
    })
        .then(handleResponse)
        .then(handleCBSSuccess)
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
        markers = response.bbList;
        renderMarkerInfo(markers);
    } else {
        console.log('error');
        console.error('Error from server:', response.message);
    }
}

function handleCBSSuccess(response) {
    if (response.success) {
        console.log(response);
        markers = response.bbList;
        renderEditMarkerInfo(markers);
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
                <th>Billboard Type</th>
                <th>Billboard size</th>
                <th>Billboard Date</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${reportsToDisplay.map((report, index) => `
                <tr>
                    <td>${report.address}</td>
                    <td>${report.type}</td>
                    <td>${report.size}</td>
                    <td>${report.date}</td>
                    <td class="button">
                        <button class="edit-button" data-index="${startIndex + index}">Gửi yêu cầu</button>
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

    const totalPages = Math.ceil(markers.length / itemsPerPage);
    const paginationHtml = Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return `<span class="page-number ${pageNumber === currentPage ? 'active' : ''}">${pageNumber}</span>`;
    }).join('');

    pageNumbersContainer.innerHTML = paginationHtml;

    contentContainer.style.display = 'block';

    attachEditButtonListeners();
}

function renderEditMarkerInfo(reports) {
    const contentContainer = document.getElementById('content-container');
    const userDetailsElement = document.getElementById('user-details');
    const additionalActionsElement = document.getElementById('additional-actions');
    const paginationElement = document.getElementById('pagination');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const reportsToDisplay = reports.slice(startIndex, endIndex);
    console.log(reportsToDisplay)
    console.log('cbs type', reportsToDisplay[0].type)
    console.log('cbs size', reportsToDisplay[0].size)
    const html = `
    <table class="report-table">
        <thead>
        <tr>
        <th>Address</th>
        <th>Billboard Type</th>
        <th>Billboard size</th>
        <th>Billboard Date</th>
        <th>Sending Date</th>
        <th>Reason</th>
        <th>Action</th>
    </tr>
        </thead>
        <tbody>
            ${reportsToDisplay.map((report, index) => `
                <tr>
                    <td>${report.address}</td>
                    <td>${report.type}</td>
                    <td>${report.size}</td>
                    <td>${report.date}</td>
                    <td>${report.editDate}</td>
                    <td>${report.reason}</td>
                    <td class="button">
                        <button class="edit-button cbs" data-index="${startIndex + index}">Duyệt</button>
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

    const totalPages = Math.ceil(markers.length / itemsPerPage);
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
            showEditForm(markers[reportIndex], reportIndex);
        });
    });
    const cbsButton = document.querySelectorAll('.cbs');
    if (cbsButton) {
        cbsButton.forEach((cbsBtn) => {
            cbsBtn.addEventListener('click', () => {
                const reportIndex = parseInt(cbsBtn.getAttribute('data-index'), 10);
                showCBSEditForm(markers[reportIndex], reportIndex);
            });
        });
    }
}

function attachDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', () => {
            const reportIndex = parseInt(deleteButton.getAttribute('data-index'), 10);
            const confirmation = confirm('Are you sure you want to delete this Billboard?');
            if (confirmation) {
                console.log('có vô đây');
                console.log('đây là ', markers[reportIndex].address);
                deleteEditedMarker(markers[reportIndex].address, reportIndex);
            }
        });
    });
}

function deleteEditedMarker(reportContent, index) {
    console.log('có đi vô hàm này')

    fetch(`http://localhost:3030/api/billboardEdit/${reportContent}`, {
        method: 'DELETE',
        headers: {
            'Authorization': accessToken,
        },
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

function showCBSEditForm(report, index) {
    const editForm = document.querySelector('.edit-form');
    editForm.querySelector('#adType').value = report.type;
    editForm.querySelector('#size').value = report.size;
    editForm.querySelector('#date').value = report.date;
    editForm.querySelector('#editDate').style.display = 'none';
    editForm.querySelector('label[for="editDate"]').style.display = 'none';
    editForm.querySelector('#reason').style.display = 'none';
    editForm.style.display = 'block';

    const saveButton = editForm.querySelector('.save-edit');
    saveButton.addEventListener('click', () => {
        saveEditedMarker(report, index);
    });
}

function showEditForm(report, index) {
    const editForm = document.querySelector('.edit-form');
    editForm.querySelector('#adType').value = report.type;
    editForm.querySelector('#size').value = report.size;
    editForm.querySelector('#date').value = report.date;

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
        type: editForm.querySelector('#adType').value = report.type,
        size: editForm.querySelector('#size').value = report.size,
        date: editForm.querySelector('#date').value = report.date,
        editDate: editForm.querySelector('#editDate').value,
        reason: editForm.querySelector('#reason').value,
    };

    console.log(updatedReport);

    fetch(`http://localhost:3030/api/billboardEdit/billboard`, {
        method: 'POST',
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
                alert(response.message)
                location.reload();
            } else {
                console.error('Error deleting report:', response.message);
            }
        })
        .catch(handleError);
}

function saveEditedMarker(report, index) {
    const editForm = document.querySelector('.edit-form');

    const updatedReport = {
        address: report.address,
        type: editForm.querySelector('#adType').value = report.type,
        size: editForm.querySelector('#size').value = report.size,
        date: editForm.querySelector('#date').value = report.date,
    };

    console.log(updatedReport);

    fetch(`http://localhost:3030/api/billboard/update_billboard`, {
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
                alert(response.message)
                location.reload();
            } else {
                console.error('Error deleting report:', response.message);
            }
        })
        .catch(handleError);
}