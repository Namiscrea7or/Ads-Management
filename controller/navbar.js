document.addEventListener('DOMContentLoaded', function () {
    const navbarNav = document.getElementById('navbarNav');
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        const logoutLink = document.createElement('li');
        logoutLink.className = 'nav-item';
        logoutLink.innerHTML = '<a class="nav-link" id="logoutLink" href="/login">Logout</a>';
        navbarNav.appendChild(logoutLink);
        document.getElementById('logoutLink').addEventListener('click', function () {
            localStorage.removeItem('accessToken');
            window.location.href = '/login'
        });
    } else {
        const loginLink = document.createElement('li');
        loginLink.className = 'nav-item';
        loginLink.innerHTML = '<a class="nav-link" href="/login">Login</a>';
        navbarNav.appendChild(loginLink);
    }
});
