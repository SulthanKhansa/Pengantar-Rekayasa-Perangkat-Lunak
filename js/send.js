console.log("send.js loaded");

// Send money functionality
function selectAmount(amount) {
  // Remove previous selection
  document.querySelectorAll(".amount-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  // Add selection to clicked button
  if (event && event.target) {
    event.target.classList.add("selected");
  }

  // Set amount input
  const amountInput = document.getElementById("amount");
  if (amountInput) {
    amountInput.value = amount;
  }
}

function handleTransfer(event) {
  event.preventDefault();

  const recipient = document.getElementById("tmeId").value.trim();
  const amount = parseInt(document.getElementById("amount").value) || 0;
  const currentUser = localStorage.getItem("current_user");
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");

  // Validation - silent check
  if (
    !recipient ||
    amount <= 0 ||
    !users[currentUser] ||
    !users[recipient] ||
    recipient === currentUser ||
    (users[currentUser].balance || 0) < amount
  ) {
    return;
  }

  // Ensure sender has balance property
  if (typeof users[currentUser].balance === "undefined") {
    users[currentUser].balance = 100000; // Set default balance
  }

  // Process transfer
  users[currentUser].balance -= amount;
  users[currentUser].moneyOut = (users[currentUser].moneyOut || 0) + amount;

  users[recipient].balance = (users[recipient].balance || 0) + amount;
  users[recipient].moneyIn = (users[recipient].moneyIn || 0) + amount;

  // Add transaction to sender's history
  if (!users[currentUser].transactions) {
    users[currentUser].transactions = [];
  }

  const senderTransaction = {
    id: Date.now().toString(),
    type: "send",
    amount: amount,
    description: `Transfer ke ${recipient}`,
    timestamp: new Date().toISOString(),
    status: "success",
    recipient: recipient,
  };

  users[currentUser].transactions.unshift(senderTransaction);

  // Add transaction to recipient's history (as received)
  if (!users[recipient].transactions) {
    users[recipient].transactions = [];
  }

  const recipientTransaction = {
    id: (Date.now() + 1).toString(),
    type: "receive",
    amount: amount,
    description: `Transfer dari ${currentUser}`,
    timestamp: new Date().toISOString(),
    status: "success",
    sender: currentUser,
  };

  users[recipient].transactions.unshift(recipientTransaction);

  localStorage.setItem("tme_users", JSON.stringify(users));

  // Save transfer details for success page
  const transferData = {
    recipient: recipient,
    amount: amount,
    remainingBalance: users[currentUser].balance,
    time: new Date().toLocaleString("id-ID"),
  };

  localStorage.setItem("last_transfer", JSON.stringify(transferData));

  // Redirect to success page (no alert)
  window.location.href = "transfer-success.html";
}

window.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backBtn");
  const tmeIdInput = document.getElementById("tmeId");
  const amountInput = document.getElementById("amount");
  const keyboard = document.getElementById("keyboard");
  let activeInput = null;

  // Back button navigation
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "home.html";
    });
  }

  // Form submit handler (updated - no alert)
  const form = document.getElementById("tmeForm");
  if (form) {
    form.addEventListener("submit", handleTransfer);
  }

  // Amount button handlers
  document.querySelectorAll(".amount-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      selectAmount(this.dataset.amount);
    });
  });

  // Keyboard functionality (if exists)
  if (keyboard) {
    [tmeIdInput, amountInput].forEach((input) => {
      if (input) {
        input.addEventListener("focus", () => {
          activeInput = input;
          keyboard.classList.add("show");
        });
      }
    });

    document.querySelectorAll(".key").forEach((key) => {
      key.addEventListener("click", () => {
        if (!activeInput) return;

        const value = key.textContent;

        if (key.id === "delete") {
          activeInput.value = activeInput.value.slice(0, -1);
        } else if (key.id === "done") {
          keyboard.classList.remove("show");
          activeInput.blur();
        } else {
          activeInput.value += value;
        }
      });
    });
  }
});
