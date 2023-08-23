$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const cartUpdated = urlParams.get("cartUpdated");

  if (cartUpdated) {
    updateCart();
  }

  // Update the cart display every 1 second
  setInterval(updateCart, 1000);
});

function updateCart() {
  const cartList = $("#cart");
  const cartTable = $("#cart-table");
  const emptyCartMessage = $("#empty-cart-message");
  const totalAmountSpan = $("#total-amount");

  console.log("Loading cart items from localStorage...");

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
  console.log("Retrieved cart items:", cartItems);

  let totalAmount = 0;

  cartList.empty(); // Clear existing content

  for (const productName in cartItems) {
    const { quantity, price, imageSrc } = cartItems[productName];
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
    $("<td>").addClass("product-image").appendTo(cartItem).append(
      $("<img>")
        .addClass("img-fluid cart-image") // Add a class for styling
        .attr("src", imageSrc) // Set the image source here
        .attr("alt", productName) // Provide an alt text for accessibility
    );

    $("<td>").addClass("product-name").appendTo(cartItem).append(
      $("<a>")
        .attr("href", "https://example.com/product-link") // Replace with actual link
        .text(productName)
    );

    $("<td>")
      .addClass("product-price")
      .appendTo(cartItem)
      .append(
        $("<span>")
          .addClass("woocommerce-Price-amount amount")
          .html(
            `<bdi><span class="woocommerce-Price-currencySymbol">$</span>${price.toFixed(
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
                updateCart();
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
            `<bdi><span class="woocommerce-Price-currencySymbol">$</span>${(
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
    const { quantity, price, imageSrc } = cartItems[productName];
    return {
      productName,
      quantity,
      price,
      imageSrc,
    };
  });

  // Create an object with order details
  const orderData = {
    items: orderItems,
    totalAmount: calculateTotalAmount(cartItems),
  };

  // Send the order data to the server
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/order",
    data: JSON.stringify(orderData),
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (response) {
      console.log("Order saved successfully:", response);

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

/*let userCartPage = JSON.parse(localStorage.getItem("user"));
  userCartPage = getUserFromCartPage();

async function getUserFromCartPage() {
  $.ajax({
    url: "http://localhost:3000/account/email/",
    method: "GET",
    success: function (response) {
      userCartPage = response;
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}*/