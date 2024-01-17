document.addEventListener('DOMContentLoaded', function () {
    const navbarNav = document.getElementById('navbarNav');
    const accessToken = localStorage.getItem('accessToken');

    var userRole = localStorage.getItem('userRole');
    var isCanBoSo = userRole === 'Cán bộ Sở';

    if (isCanBoSo) {
        var manageMarkerLink = document.createElement('li');
        manageMarkerLink.className = 'nav-link';
        manageMarkerLink.innerHTML = '<a class="nav-link" id="manageMarkerLink" href="/manageMarker">Manage Markers</a>';
        navbarNav.appendChild(manageMarkerLink);

        var manageBillboardLink = document.createElement('li');
        manageBillboardLink.className = 'nav-link';
        manageBillboardLink.innerHTML = '<a class="nav-link" id="manageBillboardLink" href="/managebillboard">Manage Billboards</a>';
        navbarNav.appendChild(manageBillboardLink);
    }

    if (accessToken) {
        const logoutLink = document.createElement('li');
        logoutLink.className = 'nav-item';
        logoutLink.innerHTML = '<a class="nav-link" id="logoutLink" href="/login">Logout</a>';
        navbarNav.appendChild(logoutLink);
        document.getElementById('logoutLink').addEventListener('click', function () {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');
            window.location.href = '/login'
        });
    } else {
        const loginLink = document.createElement('li');
        loginLink.className = 'nav-item';
        loginLink.innerHTML = '<a class="nav-link" href="/login">Login</a>';
        navbarNav.appendChild(loginLink);
    }


    var markersLink = document.querySelector('a[href="/markers"]');
    var billboardLink = document.querySelector('a[href="/billboard"]');
    var rpLink = document.querySelector('a[href="/report"]');

    if (userRole === 'Cán bộ Sở' || userRole === 'Cán bộ Phường' || userRole === 'Cán bộ Quận') { 
        billboardLink.style.display = 'block';
        markersLink.style.display = 'block';
        rpLink.style.display = 'block';
    } else {
        billboardLink.style.display = 'none';
        markersLink.style.display = 'none';
        rpLink.style.display = 'none';
    }
});
