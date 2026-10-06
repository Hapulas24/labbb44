document.getElementById("loginBtn").addEventListener("click", function () {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const alertBox = document.getElementById("loginAlert");

    // Demo credentials
    if (username === "admin" && password === "password123") {

        // Save login information
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);

        // Go to dashboard
        window.location.href = "dashboard.html";

    } else {

        // Show error message
        alertBox.innerHTML = `
            <div class="alert alert-danger">
                Invalid username or password.
            </div>
        `;
    }
});