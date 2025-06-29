// Simple user profile functionality
function handleSignOut() {
  localStorage.removeItem("current_user");
  window.location.href = "landing.html";
}

function loadUserData() {
  const currentUser = localStorage.getItem("current_user");
  if (!currentUser) {
    window.location.href = "landing.html";
    return;
  }

  document.getElementById("user-name").textContent = currentUser;

  const users = JSON.parse(localStorage.getItem("tme_users") || "{}");
  if (!users[currentUser]) {
    users[currentUser] = {
      id: Math.floor(Math.random() * 90) + 10,
      balance: 0,
      moneyIn: 0,
      moneyOut: 0,
    };
    localStorage.setItem("tme_users", JSON.stringify(users));
  }

  document.getElementById("user-id").textContent = users[currentUser].id;
  document.getElementById("user-balance").textContent = `Rp ${
    users[currentUser].balance || 0
  }`;
  document.getElementById("money-in").textContent = `Rp ${
    users[currentUser].moneyIn || 0
  }`;
  document.getElementById("money-out").textContent = `Rp ${
    users[currentUser].moneyOut || 0
  }`;
}

document.addEventListener("DOMContentLoaded", loadUserData);
window.handleSignOut = handleSignOut;
