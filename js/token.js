// Token data
let tokenData = {
  activeTokens: [],
};

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  const currentUser = localStorage.getItem("current_user");
  if (!currentUser) {
    window.location.href = "../html/landing.html";
    return;
  }

  // Load user balance
  loadUserBalance();

  // Load active tokens
  loadActiveTokens();

  // Load token data from localStorage
  loadTokenData();

  // Setup form submission
  setupTokenForm();

  // Display selected withdraw method
  displaySelectedMethod();
});

// Load user balance
function loadUserBalance() {
  const currentUser = localStorage.getItem("current_user");
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");

  console.log("Current user:", currentUser);
  console.log("Users data:", users);

  if (users[currentUser]) {
    // Ensure user has balance property
    if (typeof users[currentUser].balance === "undefined") {
      console.log("Setting default balance for user:", currentUser);
      users[currentUser].balance = 100000; // Set default balance
      localStorage.setItem("tme_users", JSON.stringify(users));
    }

    const balance = users[currentUser].balance || 0;
    console.log("User balance:", balance);

    const balanceElement = document.getElementById("userBalance");
    if (balanceElement) {
      balanceElement.textContent = `Rp ${balance.toLocaleString("id-ID")}`;
    }
  } else {
    console.log("User not found in data");
    const balanceElement = document.getElementById("userBalance");
    if (balanceElement) {
      balanceElement.textContent = "Rp 0";
    }
  }
}

// Load token data from localStorage
function loadTokenData() {
  const storedTokens = localStorage.getItem("tme_tokens");
  if (storedTokens) {
    tokenData = JSON.parse(storedTokens);
    // Clean expired tokens
    cleanExpiredTokens();
  }
}

// Save token data to localStorage
function saveTokenData() {
  localStorage.setItem("tme_tokens", JSON.stringify(tokenData));
}

// Setup form submission
function setupTokenForm() {
  const form = document.getElementById("tokenForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    generateToken();
  });
}

// Generate new token
function generateToken() {
  const currentUser = localStorage.getItem("current_user");
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");
  const amount = parseInt(document.getElementById("withdrawAmount").value);
  const note = document.getElementById("tokenNote").value.trim();

  console.log("Generating token for user:", currentUser);
  console.log("Amount:", amount);
  console.log("Current user data:", users[currentUser]);

  if (!amount || amount < 10000) {
    alert("Jumlah minimum withdraw adalah Rp 10.000");
    return;
  }

  // Ensure user has balance property
  if (typeof users[currentUser].balance === "undefined") {
    users[currentUser].balance = 100000;
  }

  if (!users[currentUser] || users[currentUser].balance < amount) {
    alert("Saldo tidak mencukupi");
    return;
  }

  // Generate unique token code
  const tokenCode = generateTokenCode();

  // Create token object
  const selectedMethod =
    localStorage.getItem("selected_withdraw_method") || "Token";

  const token = {
    id: `token_${Date.now()}`,
    code: tokenCode,
    amount: amount,
    note: note,
    createdBy: currentUser,
    createdAt: new Date().toISOString(),
    expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    status: "active",
    used: false,
    withdrawMethod: selectedMethod,
  };

  // Deduct amount from user balance
  users[currentUser].balance -= amount;
  console.log("New balance after deduction:", users[currentUser].balance);

  // Add transaction to user history
  if (!users[currentUser].transactions) {
    users[currentUser].transactions = [];
  }

  const withdrawMethod =
    localStorage.getItem("selected_withdraw_method") || "Token";

  const transaction = {
    id: Date.now().toString(),
    type: "withdraw",
    amount: amount,
    description: `Tarik Tunai via ${withdrawMethod} (Token: ${tokenCode})`,
    timestamp: new Date().toISOString(),
    status: "success",
    method: withdrawMethod,
    tokenCode: tokenCode,
  };

  users[currentUser].transactions.unshift(transaction);
  users[currentUser].moneyOut = (users[currentUser].moneyOut || 0) + amount;

  console.log("Transaction added:", transaction);
  console.log("Updated user data:", users[currentUser]);

  localStorage.setItem("tme_users", JSON.stringify(users));

  // Add token to active tokens
  tokenData.activeTokens.push(token);
  saveTokenData();

  // Display token
  displayGeneratedToken(token);

  // Update UI
  loadUserBalance();
  loadActiveTokens();

  // Clear form
  document.getElementById("tokenForm").reset();

  console.log("Token generation completed successfully");
}

// Generate unique token code
function generateTokenCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  // Generate 3 groups of 4 characters
  for (let group = 0; group < 3; group++) {
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    if (group < 2) result += "-";
  }

  return result;
}

// Display generated token
function displayGeneratedToken(token) {
  document.getElementById("tokenCode").textContent = token.code;
  document.getElementById(
    "tokenAmount"
  ).textContent = `Rp ${token.amount.toLocaleString("id-ID")}`;

  const expiryDate = new Date(token.expiryAt);
  document.getElementById("tokenExpiry").textContent =
    expiryDate.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (token.note) {
    document.getElementById("tokenNoteDisplay").textContent = token.note;
    document.getElementById("tokenNoteRow").style.display = "flex";
  } else {
    document.getElementById("tokenNoteRow").style.display = "none";
  }

  // Show token display and hide form
  document.querySelector(".token-form-card").style.display = "none";
  document.getElementById("tokenDisplay").classList.remove("hidden");
}

// Copy token to clipboard
function copyToken() {
  const tokenCode = document.getElementById("tokenCode").textContent;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(tokenCode)
      .then(() => {
        showSuccessModal();
      })
      .catch(() => {
        // Fallback for older browsers
        fallbackCopyText(tokenCode);
      });
  } else {
    // Fallback for older browsers
    fallbackCopyText(tokenCode);
  }
}

// Fallback copy method
function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    showSuccessModal();
  } catch (err) {
    alert("Gagal menyalin token");
  }

  document.body.removeChild(textArea);
}

// Show success modal
function showSuccessModal() {
  document.getElementById("successModal").classList.add("show");
}

// Close modal
function closeModal() {
  document.getElementById("successModal").classList.remove("show");
}

// Create new token
function createNewToken() {
  document.querySelector(".token-form-card").style.display = "block";
  document.getElementById("tokenDisplay").classList.add("hidden");
}

// Load active tokens
function loadActiveTokens() {
  const currentUser = localStorage.getItem("current_user");
  const activeTokensList = document.getElementById("activeTokensList");

  // Filter tokens for current user
  const userTokens = tokenData.activeTokens.filter(
    (token) => token.createdBy === currentUser && !token.used
  );

  if (userTokens.length === 0) {
    activeTokensList.innerHTML = `
      <div class="no-tokens">
        <i data-feather="inbox"></i>
        <p>Belum ada token aktif</p>
      </div>
    `;
  } else {
    activeTokensList.innerHTML = userTokens
      .map((token) => {
        const expiryDate = new Date(token.expiryAt);
        const isExpired = expiryDate < new Date();
        const status = isExpired ? "expired" : "active";
        const statusText = isExpired ? "Kadaluarsa" : "Aktif";

        return `
        <div class="token-item">
          <div class="token-item-header">
            <span class="token-item-code">${token.code}</span>
            <span class="token-status ${status}">${statusText}</span>
          </div>
          <div class="token-item-details">
            <span>Rp ${token.amount.toLocaleString("id-ID")}</span>
            <span>Berlaku hingga: ${expiryDate.toLocaleString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}</span>
          </div>
          ${
            token.note
              ? `<div style="margin-top: 8px; font-size: 14px; color: #64748b;">${token.note}</div>`
              : ""
          }
        </div>
      `;
      })
      .join("");
  }

  // Replace feather icons
  feather.replace();
}

// Clean expired tokens
function cleanExpiredTokens() {
  const now = new Date();
  tokenData.activeTokens = tokenData.activeTokens.filter((token) => {
    const expiryDate = new Date(token.expiryAt);
    return expiryDate > now || token.used;
  });
  saveTokenData();
}

// Display selected withdraw method
function displaySelectedMethod() {
  const selectedMethod = localStorage.getItem("selected_withdraw_method");
  if (selectedMethod) {
    // Update form description to show selected method
    const formDescription = document.querySelector(".form-description");
    if (formDescription) {
      formDescription.textContent = `Generate token untuk withdraw uang tunai di ${selectedMethod}`;
    }

    // Clear the selected method from localStorage after displaying
    localStorage.removeItem("selected_withdraw_method");
  }
}

// Close modal when clicking outside
document.addEventListener("click", function (event) {
  const modal = document.getElementById("successModal");
  if (event.target === modal) {
    closeModal();
  }
});

// Back button functionality
function goBack() {
  // Clear selected withdraw method when going back
  localStorage.removeItem("selected_withdraw_method");
  window.location.href = "home.html";
}

// Refresh active tokens every minute
setInterval(() => {
  cleanExpiredTokens();
  loadActiveTokens();
}, 60000);
