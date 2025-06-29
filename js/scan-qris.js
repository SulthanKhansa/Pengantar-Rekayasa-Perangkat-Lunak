// Scan QRIS functionality
let flashActive = false;

// Flash toggle
function toggleFlash() {
  const flashBtn = document.getElementById("flashBtn");
  flashBtn.classList.toggle("active");
}

// Show manual input modal
function openManualInput() {
  const modal = document.getElementById("manualModal");
  modal.classList.add("show");
}

// Hide manual input modal
function closeManualInput() {
  const modal = document.getElementById("manualModal");
  modal.classList.remove("show");
  document.getElementById("qrisCode").value = "";
}

// Process manual input
function processManualInput() {
  const qrisCode = document.getElementById("qrisCode").value.trim();

  if (!qrisCode) {
    return;
  }

  // For demo purposes, redirect to home
  window.location.href = "home.html";
}

// Open gallery (simulation)
function openGallery() {
  // For demo purposes, silently return without any action
  return;
}

// Go to history
function openHistory() {
  window.location.href = "history.html";
}

// Go back to home
function goBack() {
  window.location.href = "home.html";
}

document.addEventListener("DOMContentLoaded", function () {
  // Gallery button
  const galleryBtn = document.getElementById("galleryBtn");
  if (galleryBtn) {
    galleryBtn.addEventListener("click", openGallery);
  }

  // Manual input button
  const manualBtn = document.getElementById("manualBtn");
  if (manualBtn) {
    manualBtn.addEventListener("click", openManualInput);
  }

  // History button
  const historyBtn = document.getElementById("historyBtn");
  if (historyBtn) {
    historyBtn.addEventListener("click", openHistory);
  }

  // Flash button
  const flashBtn = document.getElementById("flashBtn");
  if (flashBtn) {
    flashBtn.addEventListener("click", toggleFlash);
  }

  // Modal close button
  const closeModal = document.getElementById("closeModal");
  if (closeModal) {
    closeModal.addEventListener("click", closeManualInput);
  }

  // Process button
  const processBtn = document.getElementById("processBtn");
  if (processBtn) {
    processBtn.addEventListener("click", processManualInput);
  }

  // Close modal when clicking outside
  const modal = document.getElementById("manualModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeManualInput();
      }
    });
  }

  // Back button
  const backIcon = document.querySelector(".back-icon");
  if (backIcon) {
    backIcon.addEventListener("click", function (e) {
      e.preventDefault();
      goBack();
    });
  }
});
