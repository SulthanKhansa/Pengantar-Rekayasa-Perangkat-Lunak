// Simple landing page functionality
let isLoginMode = true;

function toggleForm() {
  const title = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");
  const toggleLink = document.getElementById("toggle-form");
  const toggleText = document.getElementById("toggle-text");
  const notifMsg = document.getElementById("notif-msg");

  if (isLoginMode) {
    // Switch to Register mode
    title.textContent = "Daftar";
    submitBtn.textContent = "Daftar";
    toggleText.textContent = "Sudah punya akun?";
    toggleLink.textContent = "Login di sini";
    isLoginMode = false;
  } else {
    // Switch to Login mode
    title.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleText.textContent = "Belum punya akun?";
    toggleLink.textContent = "Daftar di sini";
    isLoginMode = true;
  }

  // Clear fields and notification
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  notifMsg.textContent = "";
  notifMsg.className = "message";
}

function handleSubmit() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const notifMsg = document.getElementById("notif-msg");

  if (!username || !password) {
    notifMsg.textContent = "Username dan password harus diisi";
    return;
  }

  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");

  if (isLoginMode) {
    // Login
    if (users[username] && users[username].password === password) {
      localStorage.setItem("current_user", username);
      console.log("Login successful, redirecting to:", "html/home.html");
      window.location.href = "html/home.html";
    } else {
      notifMsg.textContent = "Username atau password salah";
      console.log("Login failed:", username, "User exists:", !!users[username]);
    }
  } else {
    // Register
    if (users[username]) {
      notifMsg.textContent = "Username sudah terdaftar";
      return;
    }

    users[username] = {
      password: password,
      balance: 100000,
      moneyIn: 0,
      moneyOut: 0,
      id: Math.floor(Math.random() * 90) + 10,
    };

    localStorage.setItem("tme_users", JSON.stringify(users));
    notifMsg.textContent = "Registrasi berhasil! Silakan login.";

    setTimeout(() => {
      toggleForm();
    }, 1500);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("toggle-form").addEventListener("click", toggleForm);
  document.getElementById("submit-btn").addEventListener("click", handleSubmit);
});
