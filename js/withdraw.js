// This script handles the interactive logic for the withdraw page.

// Wait for the entire window to load before executing the script
window.onload = function () {
  // Replace all `data-feather` icons with SVG icons from Feather Icons library
  feather.replace();

  // Get references to key DOM elements
  const continueBtn = document.getElementById("continueBtn"); // The "Lanjutkan" button
  const radioButtons = document.querySelectorAll('input[name="method"]'); // All radio buttons for withdrawal methods
  const notif = document.getElementById("notif"); // The notification display area
  const notifMessage = document.getElementById("notif-message"); // The span inside the notification for the message

  // Add an event listener to the "Lanjutkan" button for click events
  continueBtn.addEventListener("click", () => {
    let selectedMethod = null; // Variable to store the value of the selected method

    // Iterate over all radio buttons to find which one is checked
    radioButtons.forEach((radio) => {
      if (radio.checked) {
        selectedMethod = radio.value; // Store the value of the checked radio button
      }
    });

    // Check if a withdrawal method has been selected
    if (selectedMethod) {
      // Check if the selected method is a token-based method
      const tokenMethods = ["ATM Bersama", "Indomaret", "Alfamart"];

      if (tokenMethods.includes(selectedMethod)) {
        // For token methods, redirect to token page
        console.log("Redirecting to token page for method:", selectedMethod);
        localStorage.setItem("selected_withdraw_method", selectedMethod);
        window.location.href = "token.html";
      } else {
        // For other methods, show notification and stay on current page
        const notifMessage = document.getElementById("notif-message");
        if (notifMessage) {
          notifMessage.textContent = `Anda memilih metode: ${selectedMethod}. Lanjutkan ke langkah berikutnya...`;
        } else {
          notif.textContent = `Anda memilih metode: ${selectedMethod}. Lanjutkan ke langkah berikutnya...`;
        }
        notif.style.display = "block";
        notif.style.color = "#155724";
        notif.style.backgroundColor = "#d4edda";
        notif.style.borderColor = "#c3e6cb";
      }
    } else {
      // If no method is selected, display an error notification
      const notifMessage = document.getElementById("notif-message");
      const errorText =
        "Harap pilih salah satu metode penarikan terlebih dahulu.";

      if (notifMessage) {
        notifMessage.textContent = errorText;
      } else {
        notif.textContent = errorText;
      }
      notif.style.display = "block";
      notif.style.color = "#b91c1c";
      notif.style.backgroundColor = "#fee2e2";
      notif.style.borderColor = "#fca5a5";
    }
  });

  // Add event listeners to all radio buttons to hide the notification when a new method is selected
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
      // Hide the notification whenever a different radio button is chosen
      notif.style.display = "none";
    });
  });
};
