// Open modal function with smooth animation
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "flex";
  modal.style.opacity = "0"; // Start with 0 opacity
  setTimeout(() => {
    modal.style.opacity = "1"; // Fade in
  }, 50);

  // Prevent page scroll when modal is open
  document.body.style.overflow = "hidden";
}

// Close modal function with smooth animation
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.opacity = "0"; // Fade out
  setTimeout(() => {
    modal.style.display = "none";
    clearForm(modalId); // Clear checkboxes and name field

    // Allow page scroll when modal is closed
    document.body.style.overflow = "auto";
  }, 300); // Delay matches the fade-out transition
}

// Submit ingredients function with name validation
function submitIngredients(saborName, complementoName, molhoName, nomeId) {
  const sabores = document.getElementsByName(saborName);
  const complementos = document.getElementsByName(complementoName);
  const molhos = document.getElementsByName(molhoName);
  const nome = document.getElementById(nomeId).value;

  // Check if the name field is empty
  if (!nome.trim()) {
    alert("Por favor, insira o seu nome.");
    return; // Exit the function if name is not provided
  }

  // Get selected options
  const selectedSabores = Array.from(sabores)
    .filter((item) => item.checked)
    .map((item) => item.value);
  const selectedComplementos = Array.from(complementos)
    .filter((item) => item.checked)
    .map((item) => item.value);
  const selectedMolhos = Array.from(molhos)
    .filter((item) => item.checked)
    .map((item) => item.value);

  // Add to cart
  addToCart(nome, selectedSabores, selectedComplementos, selectedMolhos);

  // Close modal after submission
  closeModal(`modal${nomeId.charAt(nomeId.length - 1)}`);
}

// Limit selection function
function limitSelection(name, max) {
  const checkboxes = document.getElementsByName(name);
  const checkedCount = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  ).length;

  if (checkedCount > max) {
    alert(`Você pode selecionar no máximo ${max} opções.`);
    event.target.checked = false;
  }
}

// Add item to cart function with smooth addition animation
function addToCart(nome, sabores, complementos, molhos) {
  const cartItems = document.getElementById("cartItems");

  // Create cart item element
  const cartItem = document.createElement("div");
  cartItem.className = "cart-item";
  const itemId = Date.now();

  cartItem.id = `item-${itemId}`;
  cartItem.innerHTML = `
    <h3>${nome.toUpperCase()}</h3>
    <p>Sabores: ${sabores.join(", ").toUpperCase()}</p>
    <p>Complementos: ${complementos.join(", ").toUpperCase()}</p>
    <p>Molhos: ${molhos.join(", ").toUpperCase()}</p>
    <button onclick="removeFromCart(${itemId})" class="remove-button">Remover</button>
  `;

  // Append to cart
  cartItems.appendChild(cartItem);

  // Scroll to bottom when item is added
  cartItems.scrollTop = cartItems.scrollHeight;
}

// Remove item from cart with smooth removal animation
function removeFromCart(itemId) {
  const cartItem = document.getElementById(`item-${itemId}`);
  if (cartItem) {
    cartItem.style.opacity = "0"; // Fade out before removal
    setTimeout(() => {
      cartItem.remove();
    }, 300); // Delay matches the fade-out transition
  }
}

// Open cart function
function openCart() {
  openModal("cartModal");
}

// Clear checkboxes and name function
function clearForm(modalId) {
  const modal = document.getElementById(modalId);
  const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => (checkbox.checked = false));

  const textInputs = modal.querySelectorAll('input[type="text"]');
  textInputs.forEach((input) => (input.value = ""));
}

// Clear cart function
function clearCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = ""; // Remove all cart items
}

// Send order function with WhatsApp integration
function sendOrder() {
  const cartItems = document.querySelectorAll("#cartItems .cart-item");
  if (cartItems.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let message = "PEDIDOS:\n\n";
  cartItems.forEach((item) => {
    const name = item.querySelector("h3").innerText;
    const sabores = item
      .querySelector("p:nth-of-type(1)")
      .innerText.replace("Sabores: ", "");
    const complementos = item
      .querySelector("p:nth-of-type(2)")
      .innerText.replace("Complementos: ", "");
    const molhos = item
      .querySelector("p:nth-of-type(3)")
      .innerText.replace("Molhos: ", "");

    // Format the message with uppercase and more line breaks between sections
    message +=
      `NOME: ${name.toUpperCase()}\n\n` +
      `SABORES:\n${sabores.toUpperCase()}\n\n` +
      `COMPLEMENTOS:\n${complementos.toUpperCase()}\n\n` +
      `MOLHOS:\n${molhos.toUpperCase()}\n\n\n`;
  });

  // Replace the phone number with your WhatsApp number
  const phoneNumber = "5581994956795"; // Your WhatsApp number
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  // Open WhatsApp with the message
  window.open(url, "_blank");

  // Clear cart after sending the order
  clearCart();
}
