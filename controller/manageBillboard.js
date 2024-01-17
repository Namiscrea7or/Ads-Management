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
    if (role === 'Cán bộ Sở') {
        showMarkerCBS(accessToken)
    }
});

function showMarkerCBS(accessToken) {
    fetch('http://localhost:3030/api/billboard/info', {
        method: 'GET',
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
function handleCBSSuccess(response) {
    if (response.success) {
        console.log(response);
        markers = response.bbList;
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
                <th>Billboard Type</th>
                <th>Billboard Size</th>
                <th>Date</th>
                <th>Is checking legit?</th>
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
                    <td>${report.isActivated}</td>
                    <td class="button">
                        ${report.isActivated
            ? `<button class="remove-button" data-index="${startIndex + index}">Bãi Bỏ</button>`
            : `<button class="edit-button" data-index="${startIndex + index}">Duyệt</button>`}
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
    attachRemoveButtonListeners();
}

function attachEditButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach((editButton) => {
        editButton.addEventListener('click', () => {
            const reportIndex = parseInt(editButton.getAttribute('data-index'), 10);
            const confirmation = confirm('Are you sure you want to save this marker?');
            if (confirmation) {
                saveEditedMarker(markers[reportIndex], reportIndex);
            }
        });
    });
}

function attachRemoveButtonListeners() {
    const editButtons = document.querySelectorAll('.remove-button');
    editButtons.forEach((editButton) => {
        editButton.addEventListener('click', () => {
            const reportIndex = parseInt(editButton.getAttribute('data-index'), 10);
            const confirmation = confirm('Are you sure you want to remove this marker?');
            if (confirmation) {
                saveRemoveMarker(markers[reportIndex], reportIndex);
            }
        });
    });
}

function saveRemoveMarker(report, index) {
    const updatedReport = {
        address: report.address,
        type: report.type,
        size: report.size,
        date: report.date,
        isActivated: false
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
                markers.splice(index, 1);
                alert(response.message)
                location.reload();
            } else {
                console.error('Error:', response.message);
            }
        })
        .catch(handleError);
}



function saveEditedMarker(report, index) {

    const updatedReport = {
        address: report.address,
        type: report.type,
        size: report.size,
        date: report.date,
        isActivated: true
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
                markers.splice(index, 1);
                alert(response.message)
                location.reload();
            } else {
                console.error('Error:', response.message);
            }
        })
        .catch(handleError);
}
