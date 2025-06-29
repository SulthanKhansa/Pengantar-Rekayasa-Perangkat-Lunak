// Transfer success page functionality
function loadTransferDetails() {
  const transferData = JSON.parse(localStorage.getItem("last_transfer") || "{}");
  
  if (!transferData.recipient || !transferData.amount) {
    window.location.href = "home.html";
    return;
  }
  
  document.getElementById("recipient-name").textContent = transferData.recipient;
  document.getElementById("transfer-amount").textContent = `Rp ${transferData.amount}`;
  document.getElementById("remaining-balance").textContent = `Rp ${transferData.remainingBalance}`;
  document.getElementById("transfer-time").textContent = transferData.time;
  
  // Clear transfer data after displaying
  localStorage.removeItem("last_transfer");
}

function goToHome() {
  window.location.href = "home.html";
}

function transferAgain() {
  window.location.href = "send.html";
}

document.addEventListener("DOMContentLoaded", loadTransferDetails);