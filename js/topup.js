// Top up functionality
function handleTopup(event) {
  event.preventDefault();

  const selectedBank = document.querySelector('input[name="bank"]:checked');

  if (!selectedBank) {
    // Silently return without any error message
    return;
  }

  // For demo purposes, let's simulate a successful topup
  const currentUser = localStorage.getItem("current_user");
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");

  if (!users[currentUser]) {
    return;
  }

  // Simulate topup amount (you can modify this later with amount selection)
  const topupAmount = 100000; // Default Rp 100,000

  // Update balance
  users[currentUser].balance = (users[currentUser].balance || 0) + topupAmount;
  users[currentUser].moneyIn = (users[currentUser].moneyIn || 0) + topupAmount;

  // Add transaction to history
  if (!users[currentUser].transactions) {
    users[currentUser].transactions = [];
  }

  const transaction = {
    id: Date.now().toString(),
    type: "topup",
    amount: topupAmount,
    description: `Top Up via ${selectedBank.value}`,
    timestamp: new Date().toISOString(),
    status: "success",
    bank: selectedBank.value,
  };

  users[currentUser].transactions.unshift(transaction);
  localStorage.setItem("tme_users", JSON.stringify(users));

  // Redirect back to home immediately
  window.location.href = "home.html";
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

  // Back button handler
  const backBtn = document.querySelector(".back-icon");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      goBack();
    });
  }
});
