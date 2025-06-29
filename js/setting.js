// Profile functions
function openProfile() {
  // For demo purposes, show alert
  alert("Fitur informasi akun akan segera hadir!");
}

function changePassword() {
  alert("Fitur ubah password akan segera hadir!");
}

// Security functions
function toggleBiometric() {
  const toggle = document.getElementById("biometric-toggle");
  // Toggle will be handled by CSS
}

function setPIN() {
  alert("Fitur PIN transaksi akan segera hadir!");
}

// App settings functions
function toggleNotification() {
  const toggle = document.getElementById("notification-toggle");
  // Toggle will be handled by CSS
}

function setLanguage() {
  alert("Fitur pemilihan bahasa akan segera hadir!");
}

function setTheme() {
  const toggle = document.getElementById("theme-toggle");
  // Toggle will be handled by CSS
}

// Support functions
function openHelp() {
  alert("Fitur pusat bantuan akan segera hadir!");
}

function contactSupport() {
  alert("Hubungi customer service di: support@tme.com");
}

function showAbout() {
  alert("TME Wallet v1.0.0\nDikembangkan dengan ❤️");
}

// Logout function
function logout() {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    localStorage.removeItem("current_user");
    window.location.href = "landing.html";
  }
}

// Back button functionality
function goBack() {
  window.location.href = "home.html";
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  const currentUser = localStorage.getItem("current_user");
  if (!currentUser) {
    window.location.href = "landing.html";
    return;
  }

  // Back button handler
  const backBtn = document.querySelector(".back-icon");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      goBack();
    });
  }
});
