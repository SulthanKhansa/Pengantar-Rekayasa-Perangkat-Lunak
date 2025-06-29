// Admin panel functionality
function loadAdminData() {
  // Debug: check localStorage data
  console.log("localStorage tme_users:", localStorage.getItem("tme_users"));
  console.log(
    "localStorage current_user:",
    localStorage.getItem("current_user")
  );

  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");
  const currentUser = localStorage.getItem("current_user");

  console.log("Parsed users:", users);
  console.log("Users count:", Object.keys(users).length);

  // Load token list
  loadTokenList();

  // Load user list
  loadUserList(users, currentUser);
}

function loadTokenList() {
  const tokens = JSON.parse(localStorage.getItem("tme_tokens") || "{}");
  const tokenList = document.getElementById("token-list");

  if (!tokens.activeTokens || tokens.activeTokens.length === 0) {
    tokenList.innerHTML =
      '<div class="no-data">Tidak ada token yang tersedia</div>';
    return;
  }

  tokenList.innerHTML = tokens.activeTokens
    .map((token) => {
      const expiryDate = new Date(token.expiryAt);
      const isExpired = expiryDate < new Date();
      const status = token.used ? "used" : isExpired ? "expired" : "active";
      const statusText = token.used
        ? "Sudah Digunakan"
        : isExpired
        ? "Kadaluarsa"
        : "Aktif";

      return `
      <div class="token-item">
        <div class="token-header">
          <span class="token-code">${token.code}</span>
          <span class="token-status ${status}">${statusText}</span>
        </div>
        <div class="token-details">
          <div class="token-detail">
            <span class="detail-label">Jumlah</span>
            <span class="detail-value">Rp ${token.amount.toLocaleString(
              "id-ID"
            )}</span>
          </div>
          <div class="token-detail">
            <span class="detail-label">Dibuat oleh</span>
            <span class="detail-value">${token.createdBy}</span>
          </div>
          <div class="token-detail">
            <span class="detail-label">Berlaku hingga</span>
            <span class="detail-value">${expiryDate.toLocaleString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</span>
          </div>
          ${
            token.note
              ? `
          <div class="token-detail">
            <span class="detail-label">Catatan</span>
            <span class="detail-value">${token.note}</span>
          </div>
          `
              : ""
          }
        </div>
      </div>
    `;
    })
    .join("");
}

function loadUserList(users, currentUser) {
  const userList = document.getElementById("user-list");

  console.log("Loading user list. Users:", users);
  console.log("Current user:", currentUser);

  if (!userList) {
    console.error("user-list element not found!");
    return;
  }

  userList.innerHTML = "";

  if (Object.keys(users).length === 0) {
    userList.innerHTML =
      '<div class="no-data">Tidak ada user yang terdaftar</div>';
    console.log("No users found, showing no-data message");
  } else {
    Object.keys(users).forEach((username) => {
      const user = users[username];
      const userCard = document.createElement("div");
      userCard.className = "user-item";
      userCard.innerHTML = `
        <div class="user-header">
          <span class="username">${username} ${
        username === currentUser ? "(Current)" : ""
      }</span>
          <div class="user-actions">
            <span class="user-balance">Rp ${(user.balance || 0).toLocaleString(
              "id-ID"
            )}</span>
            <button onclick="deleteUser('${username}')" class="btn-delete" title="Hapus User">
              <i data-feather="trash-2"></i>
            </button>
          </div>
        </div>
        <div class="user-details">
          <div class="user-detail">
            <span class="detail-label">Full Name</span>
            <span class="detail-value">${user.fullName || "N/A"}</span>
          </div>
          <div class="user-detail">
            <span class="detail-label">Uang Masuk</span>
            <span class="detail-value">Rp ${(user.moneyIn || 0).toLocaleString(
              "id-ID"
            )}</span>
          </div>
          <div class="user-detail">
            <span class="detail-label">Uang Keluar</span>
            <span class="detail-value">Rp ${(user.moneyOut || 0).toLocaleString(
              "id-ID"
            )}</span>
          </div>
          <div class="user-detail">
            <span class="detail-label">Family ID</span>
            <span class="detail-value">${user.familyId || "N/A"}</span>
          </div>
        </div>
      `;
      userList.appendChild(userCard);
    });

    // Replace feather icons after adding content
    feather.replace();
  }
}

function deleteUser(username) {
  if (confirm(`Hapus user ${username}?`)) {
    const users = JSON.parse(localStorage.getItem("tme_users") || "{}");
    delete users[username];
    localStorage.setItem("tme_users", JSON.stringify(users));

    // If current user is deleted, remove current_user
    if (localStorage.getItem("current_user") === username) {
      localStorage.removeItem("current_user");
    }

    loadAdminData();
    alert("User berhasil dihapus");
  }
}

// Redeem token functionality
function redeemToken() {
  const tokenCode = document
    .getElementById("tokenCode")
    .value.trim()
    .toUpperCase();
  const resultDiv = document.getElementById("redeemResult");

  if (!tokenCode) {
    showRedeemResult("error", "Kode token tidak boleh kosong", "");
    return;
  }

  const tokens = JSON.parse(localStorage.getItem("tme_tokens") || "{}");

  if (!tokens.activeTokens) {
    showRedeemResult(
      "error",
      "Token tidak ditemukan",
      "Pastikan kode token benar"
    );
    return;
  }

  const token = tokens.activeTokens.find((t) => t.code === tokenCode);

  if (!token) {
    showRedeemResult(
      "error",
      "Token tidak ditemukan",
      "Pastikan kode token benar"
    );
    return;
  }

  if (token.used) {
    showRedeemResult(
      "error",
      "Token sudah digunakan",
      `Token ini telah digunakan sebelumnya pada ${new Date(
        token.usedAt
      ).toLocaleString("id-ID")}`
    );
    return;
  }

  const expiryDate = new Date(token.expiryAt);
  if (expiryDate < new Date()) {
    showRedeemResult(
      "error",
      "Token sudah kadaluarsa",
      `Token ini kadaluarsa pada ${expiryDate.toLocaleString("id-ID")}`
    );
    return;
  }

  // Mark token as used
  token.used = true;
  token.usedAt = new Date().toISOString();
  token.redeemedBy = "admin";

  // Save updated tokens
  localStorage.setItem("tme_tokens", JSON.stringify(tokens));

  // Show success result
  const details = `
    <strong>Jumlah:</strong> Rp ${token.amount.toLocaleString("id-ID")}<br>
    <strong>Dibuat oleh:</strong> ${token.createdBy}<br>
    <strong>Catatan:</strong> ${token.note || "Tidak ada"}<br>
    <strong>Waktu redeem:</strong> ${new Date().toLocaleString("id-ID")}
  `;

  showRedeemResult("success", "Token berhasil di-redeem!", details);

  // Clear input
  document.getElementById("tokenCode").value = "";

  // Refresh admin data
  loadAdminData();

  // Replace feather icons
  feather.replace();
}

function showRedeemResult(type, title, details) {
  const resultDiv = document.getElementById("redeemResult");
  const iconName = type === "success" ? "check-circle" : "x-circle";

  resultDiv.className = `redeem-result ${type}`;
  resultDiv.innerHTML = `
    <div class="result-header">
      <i data-feather="${iconName}"></i>
      ${title}
    </div>
    <div class="result-details">${details}</div>
  `;
  resultDiv.classList.remove("hidden");

  // Replace feather icons
  feather.replace();
}

document.addEventListener("DOMContentLoaded", loadAdminData);

// Export functions to window for HTML onclick handlers
window.deleteUser = deleteUser;
window.redeemToken = redeemToken;
