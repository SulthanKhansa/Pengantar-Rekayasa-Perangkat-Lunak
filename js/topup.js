// Top up functionality
function handleTopup(event) {
  event.preventDefault();

  const selectedBank = document.querySelector('input[name="bank"]:checked');
  const amountInput = document.getElementById("amount");
  const amount = parseInt(amountInput.value.replace(/[^\d]/g, "")) || 0;

  if (!selectedBank) {
    showNotification("Pilih metode pembayaran terlebih dahulu", "error");
    return;
  }

  if (amount < 10000) {
    showNotification("Minimal top up Rp 10.000", "error");
    return;
  }

  if (amount > 10000000) {
    showNotification("Maksimal top up Rp 10.000.000", "error");
    return;
  }

  // For demo purposes, let's simulate a successful topup
  const currentUser = localStorage.getItem("current_user");
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");

  if (!users[currentUser]) {
    showNotification("User tidak ditemukan", "error");
    return;
  }

  // Update balance
  users[currentUser].balance = (users[currentUser].balance || 0) + amount;
  users[currentUser].moneyIn = (users[currentUser].moneyIn || 0) + amount;

  // Add transaction to history
  if (!users[currentUser].transactions) {
    users[currentUser].transactions = [];
  }

  const transaction = {
    id: Date.now().toString(),
    type: "topup",
    amount: amount,
    description: `Top Up via ${selectedBank.value}`,
    timestamp: new Date().toISOString(),
    status: "success",
    bank: selectedBank.value,
  };

  users[currentUser].transactions.unshift(transaction);
  localStorage.setItem("tme_users", JSON.stringify(users));

  // Show success and redirect
  showNotification("Top up berhasil!", "success");
  setTimeout(() => {
    window.location.href = "home.html";
  }, 1500);
}

// Format number with thousands separator
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Update total display
function updateTotal() {
  const amountInput = document.getElementById("amount");
  const totalDisplay = document.getElementById("total-display");
  const submitBtn = document.querySelector(".btn-continue");

  const amount = parseInt(amountInput.value.replace(/[^\d]/g, "")) || 0;

  totalDisplay.textContent = formatNumber(amount);

  // Enable/disable submit button
  const selectedBank = document.querySelector('input[name="bank"]:checked');
  submitBtn.disabled = !(amount >= 10000 && selectedBank);
}

// Show notification
function showNotification(message, type) {
  // Remove existing notifications
  const existingNotif = document.querySelector(".notif");
  if (existingNotif) {
    existingNotif.remove();
  }

  // Create new notification
  const notif = document.createElement("div");
  notif.className = `notif ${type}`;
  notif.textContent = message;

  // Insert notification at the top of the form
  const form = document.getElementById("topupForm");
  form.insertBefore(notif, form.firstChild);

  // Show notification
  setTimeout(() => {
    notif.style.display = "block";
  }, 100);

  // Hide notification after 3 seconds
  setTimeout(() => {
    if (notif.parentNode) {
      notif.remove();
    }
  }, 3000);
}

// Back button functionality
function goBack() {
  window.location.href = "home.html";
}

document.addEventListener("DOMContentLoaded", function () {
  // Form submit handler
  const form = document.getElementById("topupForm");
  if (form) {
    form.addEventListener("submit", handleTopup);
  }

  // Amount input handler
  const amountInput = document.getElementById("amount");
  if (amountInput) {
    amountInput.addEventListener("input", function (e) {
      // Only allow numbers
      let value = e.target.value.replace(/[^\d]/g, "");

      // Format with thousands separator
      if (value) {
        value = formatNumber(parseInt(value));
      }

      e.target.value = value;
      updateTotal();

      // Remove active class from quick amount buttons
      document.querySelectorAll(".quick-amount-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
    });
  }

  // Quick amount buttons
  document.querySelectorAll(".quick-amount-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const amount = parseInt(this.dataset.amount);

      // Update input
      amountInput.value = formatNumber(amount);

      // Update active state
      document
        .querySelectorAll(".quick-amount-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      updateTotal();
    });
  });

  // Bank selection handler
  document.querySelectorAll('input[name="bank"]').forEach((radio) => {
    radio.addEventListener("change", updateTotal);
  });

  // Back button handler
  const backBtn = document.querySelector(".back-icon");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      goBack();
    });
  }

  // Initialize
  updateTotal();
});
