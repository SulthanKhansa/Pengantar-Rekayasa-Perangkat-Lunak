document.addEventListener("DOMContentLoaded", function () {
  feather.replace();

  // Global variables
  let currentUser = null;

  // Load user data
  function loadUserData() {
    try {
      currentUser = localStorage.getItem("current_user");
      const users = JSON.parse(localStorage.getItem("tme_users") || "{}");

      if (!currentUser || !users[currentUser]) {
        window.location.href = "../html/landing.html";
        return;
      }

      const user = users[currentUser];

      // Ensure user has balance property
      if (typeof user.balance === "undefined") {
        user.balance = 100000; // Set default balance
        users[currentUser] = user;
        localStorage.setItem("tme_users", JSON.stringify(users));
        console.log("Added default balance for user:", currentUser);
      }

      // Update UI with user data
      const userNameEl = document.getElementById("userName");
      const userBalanceEl = document.getElementById("userBalance");
      const moneyInEl = document.getElementById("moneyIn");
      const moneyOutEl = document.getElementById("moneyOut");

      if (userNameEl) userNameEl.textContent = user.fullName || currentUser;
      if (userBalanceEl)
        userBalanceEl.textContent = `Rp ${(user.balance || 0).toLocaleString(
          "id-ID"
        )}`;
      if (moneyInEl)
        moneyInEl.textContent = `Rp ${(user.moneyIn || 0).toLocaleString(
          "id-ID"
        )}`;
      if (moneyOutEl)
        moneyOutEl.textContent = `Rp ${(user.moneyOut || 0).toLocaleString(
          "id-ID"
        )}`;
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  loadUserData();

  initializeShortcuts();
  initializePromos();
});

function initializeShortcuts() {
  const shortcuts = [
    { icon: "wifi", text: "Internet" },
    { icon: "zap", text: "Listrik" },
    { icon: "users", text: "Family" },
    { icon: "tv", text: "TV Kabel" },
    { icon: "droplet", text: "Air" },
    { icon: "target", text: "Games" },
    { icon: "book", text: "Pendidikan" },
    { icon: "star", text: "TME Points" },
  ];

  const shortcutSection = document.querySelector(".shortcuts");
  shortcuts.forEach((item) => {
    const button = document.createElement("button");
    button.className = "shortcut-btn";
    button.innerHTML = `
      <i data-feather="${item.icon}"></i>
      <span>${item.text}</span>
    `;
    shortcutSection.appendChild(button);
  });
  feather.replace();
}

function initializePromos() {
  const promos = [
    { src: "../img/topup.jpeg", alt: "Promo 1" },
    { src: "../img/listrik.webp", alt: "Promo 2" },
    { src: "../img/pulsa.jpeg", alt: "Promo 3" },
  ];

  const promoList = document.querySelector(".promo-list");
  promos.forEach((promo) => {
    promoList.innerHTML += `
      <div class="promo-card">
        <img src="${promo.src}" alt="${promo.alt}" />
      </div>
    `;
  });
  promos.forEach((promo) => {
    promoList.innerHTML += `
      <div class="promo-card">
        <img src="${promo.src}" alt="${promo.alt}" />
      </div>
    `;
  });
}

// Navigation functions
function goToTopup() {
  console.log("Going to topup...");
  window.location.href = "topup.html";
}

function goToSend() {
  console.log("Going to send...");
  window.location.href = "send.html";
}

function goToWithdraw() {
  console.log("Going to withdraw...");
  window.location.href = "withdraw.html";
}

function goToHistory() {
  console.log("Going to history...");
  window.location.href = "history.html";
}

function logout() {
  localStorage.removeItem("current_user");
  window.location.href = "index.html";
}

// Profile menu toggle
function toggleProfileMenu() {
  const profileMenu = document.getElementById("profileMenu");
  if (profileMenu) {
    profileMenu.classList.toggle("show");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("Home page loaded");
  loadUserData();

  // Close profile menu when clicking outside
  document.addEventListener("click", function (event) {
    const profileIcon = document.querySelector(".profile-icon");
    const profileMenu = document.getElementById("profileMenu");

    if (profileIcon && profileMenu && !profileIcon.contains(event.target)) {
      profileMenu.classList.remove("show");
    }
  });
});

// Make functions global
window.goToTopup = goToTopup;
window.goToSend = goToSend;
window.goToWithdraw = goToWithdraw;
window.goToHistory = goToHistory;
window.logout = logout;
window.toggleProfileMenu = toggleProfileMenu;
