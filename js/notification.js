// Notification data structure
const notificationTypes = {
  topup: {
    icon: "plus-circle",
    iconClass: "success",
    title: "Top Up Berhasil",
  },
  send: {
    icon: "send",
    iconClass: "info",
    title: "Transfer Berhasil",
  },
  withdraw: {
    icon: "arrow-down",
    iconClass: "warning",
    title: "Tarik Tunai Berhasil",
  },
  receive: {
    icon: "arrow-up",
    iconClass: "success",
    title: "Uang Diterima",
  },
};

// Generate notifications from transaction history
function generateNotifications() {
  const currentUser = localStorage.getItem("current_user");
  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");

  if (!currentUser || !users[currentUser]) {
    return [];
  }

  const transactions = users[currentUser].transactions || [];

  return transactions
    .map((transaction) => {
      const type =
        notificationTypes[transaction.type] || notificationTypes.topup;
      const date = new Date(transaction.timestamp);
      const timeAgo = getTimeAgo(date);

      return {
        id: transaction.id,
        type: transaction.type,
        icon: type.icon,
        iconClass: type.iconClass,
        title: type.title,
        message: `${
          transaction.description
        } - Rp ${transaction.amount.toLocaleString("id-ID")}`,
        time: timeAgo,
        timestamp: transaction.timestamp,
        unread: isRecentTransaction(date),
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Check if transaction is recent (within 24 hours)
function isRecentTransaction(date) {
  const now = new Date();
  const diffHours = (now - date) / (1000 * 60 * 60);
  return diffHours < 24;
}

// Get time ago string
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Render notifications
function renderNotifications() {
  const notifications = generateNotifications();
  const emptyState = document.getElementById("empty-state");
  const notificationList = document.getElementById("notification-list");

  if (notifications.length === 0) {
    emptyState.style.display = "block";
    notificationList.style.display = "none";
    return;
  }

  emptyState.style.display = "none";
  notificationList.style.display = "block";

  notificationList.innerHTML = notifications
    .map(
      (notification) => `
    <div class="notification-item ${notification.unread ? "unread" : ""}" 
         onclick="markAsRead('${notification.id}')">
      <div class="notification-icon ${notification.iconClass}">
        <i data-feather="${notification.icon}"></i>
      </div>
      <div class="notification-details">
        <div class="notification-title-text">${notification.title}</div>
        <div class="notification-message">${notification.message}</div>
        <div class="notification-time">${notification.time}</div>
      </div>
    </div>
  `
    )
    .join("");

  // Replace feather icons
  feather.replace();
}

// Mark notification as read
function markAsRead(notificationId) {
  // For demo purposes, just remove unread class
  const notificationItem = event.currentTarget;
  notificationItem.classList.remove("unread");
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
    window.location.href = "../landing.html";
    return;
  }

  // Render notifications
  renderNotifications();

  // Back button handler
  const backBtn = document.querySelector(".back-icon");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      goBack();
    });
  }
});
