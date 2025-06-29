// Family Account Data
let familyData = null;

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  const currentUser = localStorage.getItem("current_user");
  if (!currentUser) {
    window.location.href = "../html/landing.html";
    return;
  }

  // Load or create family data
  loadOrCreateFamilyData(currentUser);

  // Load family data
  loadFamilyData();
  renderMembers();
  renderActivities();
  populateTransferOptions();
});

// Load or create family data for current user
function loadOrCreateFamilyData(currentUser) {
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");
  const userData = users[currentUser];

  // Check if user already belongs to a family
  const userFamilyId = userData?.familyId;

  if (userFamilyId) {
    // Load existing family data
    const familyStorage = JSON.parse(
      localStorage.getItem("tme_families") || "{}"
    );
    familyData = familyStorage[userFamilyId];

    if (familyData) {
      // Update user status to online
      const memberIndex = familyData.members.findIndex(
        (member) => member.id === currentUser
      );
      if (memberIndex >= 0) {
        familyData.members[memberIndex].status = "online";
      }
      saveFamilyData();
      return;
    }
  }

  // Create new family if user doesn't belong to any family
  const familyId = `family_${currentUser}_${Date.now()}`;

  familyData = {
    id: familyId,
    name: `Family ${userData?.fullName || currentUser}`,
    balance: 0,
    savingsBalance: 0,
    members: [
      {
        id: currentUser,
        name: userData?.fullName || currentUser,
        role: "Admin",
        status: "online",
        avatar: (userData?.fullName || currentUser).charAt(0).toUpperCase(),
      },
    ],
    activities: [
      {
        type: "member",
        title: "Grup Keluarga Dibuat",
        desc: "Grup keluarga baru telah dibuat",
        time: "Baru saja",
      },
    ],
    createdBy: currentUser,
    createdAt: new Date().toISOString(),
  };

  // Save family ID to user data
  users[currentUser].familyId = familyId;
  localStorage.setItem("tme_users", JSON.stringify(users));

  // Save family data
  saveFamilyData();
}

// Save family data to localStorage
function saveFamilyData() {
  if (!familyData) return;

  const familyStorage = JSON.parse(
    localStorage.getItem("tme_families") || "{}"
  );
  familyStorage[familyData.id] = familyData;
  localStorage.setItem("tme_families", JSON.stringify(familyStorage));
}

// Load family overview data
function loadFamilyData() {
  document.getElementById("family-name").textContent = familyData.name;
  document.getElementById(
    "member-count"
  ).textContent = `${familyData.members.length} Anggota`;
  document.getElementById(
    "family-balance"
  ).textContent = `Rp ${familyData.balance.toLocaleString("id-ID")}`;
}

// Render family members
function renderMembers() {
  const memberList = document.getElementById("memberList");

  memberList.innerHTML = familyData.members
    .map(
      (member) => `
    <div class="member-item">
      <div class="member-avatar">${member.avatar}</div>
      <div class="member-info">
        <div class="member-name">${member.name}</div>
        <div class="member-role">${member.role}</div>
      </div>
      <div class="member-status ${member.status}">${
        member.status === "online" ? "Online" : "Offline"
      }</div>
    </div>
  `
    )
    .join("");
}

// Render recent activities
function renderActivities() {
  const activityList = document.getElementById("activityList");

  activityList.innerHTML = familyData.activities
    .map(
      (activity) => `
    <div class="activity-item">
      <div class="activity-icon ${activity.type}">
        <i data-feather="${
          activity.type === "savings"
            ? "dollar-sign"
            : activity.type === "transfer"
            ? "send"
            : "user-plus"
        }"></i>
      </div>
      <div class="activity-details">
        <div class="activity-title">${activity.title}</div>
        <div class="activity-desc">${activity.desc}</div>
      </div>
      <div class="activity-time">${activity.time}</div>
    </div>
  `
    )
    .join("");

  // Replace feather icons
  feather.replace();
}

// Populate transfer recipient options
function populateTransferOptions() {
  const currentUser = localStorage.getItem("current_user");
  const transferSelect = document.getElementById("transferRecipient");

  transferSelect.innerHTML =
    '<option value="">Pilih penerima</option>' +
    familyData.members
      .filter((member) => member.id !== currentUser)
      .map((member) => `<option value="${member.id}">${member.name}</option>`)
      .join("");
}

// Modal functions
function openAddMember() {
  document.getElementById("addMemberModal").classList.add("show");
  document.getElementById("memberUsername").value = "";
  document.getElementById("memberRole").value = "member";
  hideErrorMessage("addMemberError");
}

function closeAddMember() {
  document.getElementById("addMemberModal").classList.remove("show");
}

function addMember() {
  const username = document.getElementById("memberUsername").value.trim();
  const role = document.getElementById("memberRole").value;

  if (!username) {
    showErrorMessage("addMemberError", "Username tidak boleh kosong");
    return;
  }

  // Check if user exists (simplified check)
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");
  if (!users[username]) {
    showErrorMessage("addMemberError", "User tidak ditemukan");
    return;
  }

  // Check if already member
  if (familyData.members.some((member) => member.id === username)) {
    showErrorMessage("addMemberError", "User sudah menjadi anggota keluarga");
    return;
  }

  // Add new member
  const userData = users[username];
  const newMember = {
    id: username,
    name: userData.fullName || username,
    role: role === "admin" ? "Admin" : "Anggota",
    status: "offline",
    avatar: (userData.fullName || username).charAt(0).toUpperCase(),
  };

  familyData.members.push(newMember);

  // Save family ID to the new member's user data
  users[username].familyId = familyData.id;
  localStorage.setItem("tme_users", JSON.stringify(users));

  // Update UI
  loadFamilyData();
  renderMembers();
  populateTransferOptions();

  // Add activity
  familyData.activities.unshift({
    type: "member",
    title: "Anggota Baru",
    desc: `${userData.fullName || username} bergabung dengan keluarga`,
    time: "Baru saja",
  });
  renderActivities();

  // Save family data
  saveFamilyData();

  closeAddMember();
}

function openFamilySavings() {
  document.getElementById("familySavingsModal").classList.add("show");
  document.getElementById("savingsAmount").value = "";
  document.getElementById("savingsNote").value = "";

  // Update savings total display
  const savingsTotal = document.querySelector(".savings-total .total-amount");
  if (savingsTotal) {
    savingsTotal.textContent = `Rp ${familyData.savingsBalance.toLocaleString(
      "id-ID"
    )}`;
  }
}

function closeFamilySavings() {
  document.getElementById("familySavingsModal").classList.remove("show");
}

function addToSavings() {
  const amount = parseInt(document.getElementById("savingsAmount").value) || 0;
  const note = document.getElementById("savingsNote").value.trim();
  const currentUser = localStorage.getItem("current_user");

  if (amount <= 0) {
    alert("Jumlah setoran harus lebih dari 0");
    return;
  }

  // Check user balance
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");

  // Ensure user has balance property
  if (users[currentUser] && typeof users[currentUser].balance === "undefined") {
    users[currentUser].balance = 100000; // Set default balance
    localStorage.setItem("tme_users", JSON.stringify(users));
  }

  if (!users[currentUser] || (users[currentUser].balance || 0) < amount) {
    alert("Saldo tidak mencukupi");
    return;
  }

  // Update balances
  users[currentUser].balance -= amount;
  familyData.savingsBalance += amount;
  familyData.balance += amount;

  localStorage.setItem("tme_users", JSON.stringify(users));

  // Add activity
  const currentUserName = users[currentUser].fullName || currentUser;
  familyData.activities.unshift({
    type: "savings",
    title: "Setoran Tabungan",
    desc: `${currentUserName} menabung Rp ${amount.toLocaleString("id-ID")}${
      note ? ` - ${note}` : ""
    }`,
    time: "Baru saja",
  });

  // Update UI
  loadFamilyData();
  renderActivities();

  // Save family data
  saveFamilyData();

  closeFamilySavings();
  alert("Setoran berhasil!");
}

function openQuickTransfer() {
  document.getElementById("quickTransferModal").classList.add("show");
  document.getElementById("transferRecipient").value = "";
  document.getElementById("transferAmount").value = "";
  document.getElementById("transferMessage").value = "";
}

function closeQuickTransfer() {
  document.getElementById("quickTransferModal").classList.remove("show");
}

function sendQuickTransfer() {
  const recipient = document.getElementById("transferRecipient").value;
  const amount = parseInt(document.getElementById("transferAmount").value) || 0;
  const message = document.getElementById("transferMessage").value.trim();
  const currentUser = localStorage.getItem("current_user");

  if (!recipient) {
    alert("Pilih penerima transfer");
    return;
  }

  if (amount <= 0) {
    alert("Jumlah transfer harus lebih dari 0");
    return;
  }

  // Check user balance
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");

  // Ensure user has balance property
  if (users[currentUser] && typeof users[currentUser].balance === "undefined") {
    users[currentUser].balance = 100000; // Set default balance
    localStorage.setItem("tme_users", JSON.stringify(users));
  }

  if (!users[currentUser] || (users[currentUser].balance || 0) < amount) {
    alert("Saldo tidak mencukupi");
    return;
  }

  // Process transfer
  users[currentUser].balance -= amount;
  if (users[recipient]) {
    users[recipient].balance = (users[recipient].balance || 0) + amount;
  }

  localStorage.setItem("tme_users", JSON.stringify(users));

  // Find recipient name
  const recipientMember = familyData.members.find(
    (member) => member.id === recipient
  );
  const recipientName = recipientMember ? recipientMember.name : recipient;
  const currentUserName = users[currentUser].fullName || currentUser;

  // Add activity
  familyData.activities.unshift({
    type: "transfer",
    title: "Transfer Cepat",
    desc: `${currentUserName} → ${recipientName} Rp ${amount.toLocaleString(
      "id-ID"
    )}${message ? ` - ${message}` : ""}`,
    time: "Baru saja",
  });

  renderActivities();

  // Save family data
  saveFamilyData();

  closeQuickTransfer();
  alert("Transfer berhasil!");
}

function openFamilyHistory() {
  alert("Fitur Riwayat Keluarga akan segera hadir!");
}

// Utility functions
function showErrorMessage(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.classList.add("show");
}

function hideErrorMessage(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.classList.remove("show");
}

// Back button functionality
function goBack() {
  window.location.href = "home.html";
}

// Close modals when clicking outside
document.addEventListener("click", function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  });
});
