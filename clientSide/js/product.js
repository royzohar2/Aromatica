let productId;
$(document).ready(function () {
  const searchResultsContainer = $("#searchResults");
  searchResultsContainer.empty();

  productId = router.getParams().replace("id=", "");
  console.log("Product ID:", productId);

  // Fetch product details from the server
  $.ajax({
    type: "GET",
    url: `http://localhost:3000/perfumes/${productId}`,
    dataType: "json",
    success: function (product) {
      $("#product-image").attr("src", product.image);
      $("#product-name").text(product.name);
      $("#product-brand").text(`Brand: ${product.brand}`);
      $("#product-price").text(`Price: ₪${product.price}`);
    }
  })
});

function addToCart() {
  const productImage = $("#product-image").attr("src");
  const productName = $("#product-name").text();
  const productPriceStr = $("#product-price").text();
  const productPrice = parseFloat(productPriceStr.replace("Price: ₪", ""));


  // Check if the user is logged in
  if (!isUserLoggedIn()) {
    alert("Please log in to add items to your cart.");
    // Redirect to the login page or display a login modal
    return;
  }
  // Check if the product already exists in the cart
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
  if (cartItems[productName]) {
    cartItems[productName].quantity++;
  } else {
    cartItems[productName] = {
      quantity: 1,
      price: productPrice,
      imageSrc: productImage,
      productId: productId,
    };
  }

  // Save the updated cart items to local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Provide feedback to the user (e.g., show a message or update UI)
  alert(`${productName} added to cart.`);
}

// Function to check if the user is logged in
function isUserLoggedIn() {
  const token = localStorage.getItem("token");
  return token !== null;
}

