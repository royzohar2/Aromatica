let socket;

$(document).ready(function () {
  // Remove the setInterval code that updates the cart display every second
  const urlParams = new URLSearchParams(window.location.search);
  const cartUpdated = urlParams.get("cartUpdated");

  if (cartUpdated) {
    updateCart();
  }

  updateCart();

  // Connect to the WebSocket server
  socket = io("http://localhost:3005", {
    transports: ["websocket"],
  });
  // Listen for the "orderConfirmation" event
  socket.on("connect", function () {
    console.log("Connected to socket.io server");
    socket.emit("message", "Hello World from client");
  });

  socket.on("orderConfirmation", function (message) {
    console.log("Recive messege:", message);
    appendMessageToModal(message , 5000);
  });
});

// Define the function to append a message to the modal and show it with a delay
function appendMessageToModal(message, delayMilliseconds) {
  setTimeout(function () {
    const orderConfirmationMessageElement = document.getElementById("orderConfirmationMessage");
    const orderConfirmationModal = new bootstrap.Modal(document.getElementById("orderConfirmationModal"));

    orderConfirmationMessageElement.textContent = message;
    orderConfirmationModal.show();
  }, delayMilliseconds);
}

function updateCart() {
  const cartList = $("#cart");
  const cartTable = $("#cart-table");
  const emptyCartMessage = $("#empty-cart-message");
  const totalAmountSpan = $("#total-amount");

  console.log("Loading cart items from localStorage...");

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

  let totalAmount = 0;

  cartList.empty(); // Clear existing content

  for (const productName in cartItems) {
    const { quantity, price, imageSrc} = cartItems[productName];

    totalAmount += quantity * price;

    const cartItem = $("<tr>").appendTo(cartList);

    $("<td>")
      .addClass("product-remove")
      .appendTo(cartItem)
      .append(
        $("<a>")
          .addClass("remove")
          .attr("href", "javascript:void(0)")
          .text("×")
          .click(function () {
            delete cartItems[productName];
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            updateCart();
          })
      );

    // Create the cell for the product image
    $("<td>")
      .addClass("product-image")
      .appendTo(cartItem)
      .append(
        $("<img>")
          .addClass("img-fluid cart-image")
          .attr("src", imageSrc)
          .attr("alt", productName)
      );

    $("<td>").addClass("product-name").appendTo(cartItem).text(productName);

    $("<td>")
      .addClass("product-price")
      .appendTo(cartItem)
      .append(
        $("<span>")
          .addClass("woocommerce-Price-amount amount")
          .html(
            `<bdi><span class="woocommerce-Price-currencySymbol">₪</span>${price.toFixed(
              2
            )}</bdi>`
          )
      );

    $("<td>")
      .addClass("product-quantity")
      .appendTo(cartItem)
      .append(
        $("<div>")
          .addClass("quantity")
          .append(
            $("<a>")
              .addClass("minus")
              .attr("href", "javascript:void(0)")
              .text("-")
              .click(function () {
                if (quantity > 1) {
                  cartItems[productName].quantity--;
                  localStorage.setItem("cartItems", JSON.stringify(cartItems));
                  updateCart();
                }
              })
          )
          .append(
            $("<input>")
              .addClass("input-text qty text")
              .attr({ type: "number", value: quantity, min: "1" })
          )
          .append(
            $("<a>")
              .addClass("plus")
              .attr("href", "javascript:void(0)")
              .text("+")
              .click(function () {
                cartItems[productName].quantity++;
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                updateCart(); // Call updateCart after increasing the quantity
              })
          )
      );

    $("<td>")
      .addClass("product-subtotal")
      .appendTo(cartItem)
      .append(
        $("<span>")
          .addClass("woocommerce-Price-amount amount")
          .html(
            `<bdi><span class="woocommerce-Price-currencySymbol">₪</span>${(
              price * quantity
            ).toFixed(2)}</bdi>`
          )
      );
  }

  totalAmountSpan.text(totalAmount.toFixed(2));

  if ($.isEmptyObject(cartItems)) {
    emptyCartMessage.show();
    cartTable.hide();
  } else {
    emptyCartMessage.hide();
    cartTable.show();
  }

  console.log("Finished loading cart items.");
}

function shopNow() {
  // Check if the user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to proceed.");
    return;
  }

  // Retrieve cart items from local storage
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

  // Check if the cart is empty
  if ($.isEmptyObject(cartItems)) {
    alert("Your cart is empty. Add items to your cart before proceeding.");
    return;
  }

  // Prepare order data from cart items
  const orderItems = Object.keys(cartItems).map((productName) => {
    const { quantity, price, imageSrc, productId } = cartItems[productName];
    return {
      productName,
      quantity,
      price,
      imageSrc,
      productId,
    };
  });

  const productsId = [];
  orderItems.forEach((product) => {
    for (let i = 0; i < product.quantity; i++) {
      productsId.push(product.productId);
    }
  });

  // Create an object with order details
  const orderData = {
    products: productsId,
    totalAmount: calculateTotalAmount(orderItems),
  };

  // Send the order data to the server
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/order",
    contentType: "application/json",
    data: JSON.stringify(orderData),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (response) {
      //console.log("Order saved successfully:", response);

      // Emit the "orderCreated" event to trigger the order confirmation message
      socket.emit("orderCreated", orderData);

      // Clear the cart in local storage
      localStorage.removeItem("cartItems");

      // Update the cart display
      updateCart();

      // Show the "Thank you" modal only if user is logged in and cart is not empty
      if (!$.isEmptyObject(cartItems)) {
        $("#modal-3").modal("show");
      }
    },
    error: function (error) {
      console.error("Error saving order:", error);
      // Handle the error as needed
    },
  });
}

function calculateTotalAmount(cartItems) {
  let totalAmount = 0;

  for (const productName in cartItems) {
    const { quantity, price } = cartItems[productName];
    totalAmount += quantity * price;
  }

  return totalAmount;
}

// Function to post to Facebook and append to target element
function postToFacebook() {
  //https://developers.facebook.com/tools/explorer/?method=POST&path=me%3Ffields%3Did%2Cemail&version=v17.0
  const accessToken =
    "EAALwPnPZAxs0BO54ZBEo7gtJRzVnPLksKmfO19XayRsd2GghPoFXtr9GQ9ihKYfLG3GnziFlpre0PTSnNccVulwJxBZB1Lt4q0vO5btunEOIEdXa4dxwSZAedZBDNipxkvvl3RDfTUzh2jRJZAquQAgPeFz8LMSDSdHiliyBMi2ZBWz0QYZAPqzSKRzTAZBwNoHfLRTeQEermmdAV2xEsQELNqjAZD";
  const postMessage = `"🎉 Exciting News! 🎉 We just made one more happy customer with our latest product! Don't miss out – hurry up before we run out of stock! 🏃‍♂️🛍️ Grab yours now and experience the magic yourself. 🔥👇 http://127.0.0.1:5501/clientSide/index.html#home`;
  var pageId = "113961755135291";

  // Construct the API endpoint URL
  var apiUrl = "https://graph.facebook.com/v16.0/" + pageId + "/feed";

  // Set up the post data
  var postData = {
    message: postMessage,
    access_token: accessToken,
  };

  // Send the post request
  $.ajax({
    url: apiUrl,
    type: "POST",
    data: postData,
    success: function (response) {
      alert("Post successfully sent!");
    },
    error: function (xhr, status, error) {
      // Handle errors
      $("#facebook-post").html("Error sending post to Facebook.");
    },
  });
}

// Attach the modified function to the "Share on Facebook" button's click event
$(document).ready(function () {
  $("#modal-3").on("click", ".btn-primary", function () {
    postToFacebook();
  });
});
