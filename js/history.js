// History functionality
let allTransactions = [];
let currentFilter = "all";

// Load transaction history
function loadTransactionHistory() {
  const currentUser = localStorage.getItem("current_user");
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");

  console.log("Loading history for user:", currentUser);
  console.log("Users data:", users);

  if (!currentUser || !users[currentUser]) {
    window.location.href = "index.html";
    return;
  }

  // Get user's transaction history
  const userTransactions = users[currentUser].transactions || [];
  console.log("User transactions:", userTransactions);

  allTransactions = userTransactions.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  console.log("Sorted transactions:", allTransactions);
  displayTransactions(allTransactions);
}

// Display transactions
function displayTransactions(transactions) {
  const transactionList = document.getElementById("transactionList");
  const emptyState = document.getElementById("emptyState");

  if (!transactions || transactions.length === 0) {
    transactionList.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  const transactionHTML = transactions
    .map((transaction) => {
      const icon = getTransactionIcon(transaction.type);
      const amountClass =
        transaction.type === "topup" || transaction.type === "receive"
          ? "positive"
          : "negative";
      const amountSign =
        transaction.type === "topup" || transaction.type === "receive"
          ? "+"
          : "-";

      return `
      <div class="transaction-item" data-type="${transaction.type}">
        <div class="transaction-icon ${transaction.type}">
          <i data-feather="${icon}"></i>
        </div>
        <div class="transaction-details">
          <div class="transaction-type">${getTransactionTitle(
            transaction.type
          )}</div>
          <div class="transaction-desc">${transaction.description}</div>
          <div class="transaction-time">${formatDate(
            transaction.timestamp
          )}</div>
        </div>
        <div class="transaction-amount">
          <div class="transaction-value ${amountClass}">
            ${amountSign}Rp ${transaction.amount.toLocaleString("id-ID")}
          </div>
          <div class="transaction-status">Berhasil</div>
        </div>
      </div>
    `;
    })
    .join("");

  transactionList.innerHTML = transactionHTML;
  feather.replace();
}

// Get transaction icon
function getTransactionIcon(type) {
  switch (type) {
    case "topup":
      return "plus-circle";
    case "send":
      return "send";
    case "receive":
      return "arrow-down-left";
    case "withdraw":
      return "arrow-down-circle";
    default:
      return "activity";
  }
}

// Get transaction title
function getTransactionTitle(type) {
  switch (type) {
    case "topup":
      return "Top Up";
    case "send":
      return "Transfer Keluar";
    case "receive":
      return "Transfer Masuk";
    case "withdraw":
      return "Withdraw";
    default:
      return "Transaksi";
  }
}

// Format date
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("id-ID", options);
}

// Filter transactions
function filterTransactions(type) {
  currentFilter = type;

  // Update active tab
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelector(`[data-filter="${type}"]`).classList.add("active");

  // Filter and display transactions
  let filteredTransactions = allTransactions;
  if (type !== "all") {
    filteredTransactions = allTransactions.filter(
      (transaction) => transaction.type === type
    );
  }

  displayTransactions(filteredTransactions);
}

// Navigation functions
function goToTopup() {
  window.location.href = "topup.html";
}

function goToSend() {
  window.location.href = "send.html";
}

function goToWithdraw() {
  window.location.href = "withdraw.html";
}

function goToHistory() {
  window.location.href = "history.html";
}

// Back button function
function goToHome() {
  window.location.href = "home.html";
}

document.addEventListener("DOMContentLoaded", function () {
  // Load transaction history
  loadTransactionHistory();

  // Back button handler
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      goToHome();
    });
  }

  // Filter tab handlers
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const filter = this.dataset.filter;
      filterTransactions(filter);
    });
  });
});

// Make functions global for onclick
window.goToTopup = goToTopup;
window.goToSend = goToSend;
window.goToWithdraw = goToWithdraw;
window.goToHistory = goToHistory;
window.goToHome = goToHome;
