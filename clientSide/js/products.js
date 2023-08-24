$(document).ready(async function () {
  const exchangeRate = await fetchExchangeRate(); // Fetch exchange rate
  const allPerfumes = await fetchAllPerfumes();
  renderPerfumes(allPerfumes, exchangeRate);
  setFilterHendlers(exchangeRate);
});
async function fetchExchangeRate() {
  try {
    const response = await $.ajax({
      type: "GET",
      url: "http://localhost:3000/currency/exchange-rate",
      dataType: "json",
    });

    const usdToIlsRate = response.rate;
    //console.log("Exchange rate:", usdToIlsRate);
    return usdToIlsRate; // Return the exchange rate
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return 0; // Return a default value in case of error
  }
}

function renderPerfumes(perfumes, exchangeRate) {
  const perfumeList = $(".perfume-list");
  perfumeList.empty();

  perfumes.forEach((perfume) => {
    const id = perfume["_id"];
    const priceInShekels = perfume.price;
    const priceInDollars = (priceInShekels / exchangeRate).toFixed(2);

    const card = `<div class="col-12 col-md-6 col-xl-3 h-100 p-2">
    <div class="card">
      <div class="card-img-wrapper p-3 d-flex align-items-center">
        <img
          src="${perfume.image}"
          class="card-img-top h-100"
          alt="${perfume.name}"
          onclick="router.navigateTo('product', 'id=${id}');"
        />
      </div>
      <div class="card-body">
        <h5 class="card-title">${perfume.name}</h5>
        <p class="card-text">
          <p>by ${perfume.brand}</p>
          <p>Price: ₪${priceInShekels} | $${priceInDollars}</p>
        </p>
        <a href="#" class="btn btn-dark" onclick="addToCart('${perfume.name}', ${perfume.price}, '${perfume.image}')">Add To Cart</a>
      </div>
    </div>
  </div>`;

    perfumeList.append(card);
  });
}
async function fetchAllPerfumes() {
  try {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   throw new Error("Missing token");
    // }

    const response = await $.ajax({
      type: "GET",
      url: "http://localhost:3000/perfumes",
      dataType: "json",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function setFilterHendlers(exchangeRate) {
  $(".filter-option").on("click", function () {
    // Get the name of the clicked checkbox group
    const groupName = $(this).attr("name");
    // Uncheck all checkboxes in the same group except the clicked one
    $(`input[name='${groupName}']`).not(this).prop("checked", false);
  });

  //console.log("document ready products");
  // $("#btn-reset-filters").on("click", function () {
  //   $("input[type='checkbox']").prop("checked", false);
  //   renderPerfumes(allPerfumes);
  // });

  $("#btn-apply-filters").on("click", async function () {
    console.log(exchangeRate);
    const gender = $("input[name='gender']:checked").val();
    const brand = $("input[name='brand']:checked").val();
    const price = $("input[name='price']:checked").val();

    const queryParams = {};
    if (gender) queryParams.category = gender;
    if (brand) queryParams.brand = brand;
    if (price) queryParams.maxCost = price;
    console.log(queryParams);

    try {
      // const token = localStorage.getItem("token");
      // console.log(token);
      // if (!token) {
      //   throw new Error("Missing token");
      // }

      const response = await $.ajax({
        type: "GET",
        url: `http://localhost:3000/perfumes?${$.param(queryParams)}`,
        dataType: "json",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      renderPerfumes(response, exchangeRate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
}
function addToCart(productName, productPrice, productImage) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

  // Check if the user is logged in
  if (!isUserLoggedIn()) {
    alert("Please log in to add items to your cart.");
    // Redirect to the login page or display a login modal
    return;
  }

  if (cartItems[productName]) {
    cartItems[productName].quantity += 1;
  } else {
    cartItems[productName] = {
      quantity: 1,
      price: productPrice,
      imageSrc: productImage,
    };
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  alert("the item is in your cart");
}

// Function to check if the user is logged in
function isUserLoggedIn() {
  const token = localStorage.getItem("token");
  return token !== null;
}
