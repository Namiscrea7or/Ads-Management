document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    // Handle login logic
    console.log('Login form submitted');
});

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    // Handle registration logic
    console.log('Register form submitted');
});

function signInWithGoogle() {
    // Implement Google Sign-In logic using OAuth 2.0
    console.log('Signing in with Google');
}
