(() => {
  $(document).ready(function () {
    console.log("document ready index");

    setDialogHandler();
    setNavBarHandler();
    updateAuthButtons(); // Update the authentication buttons on page load
    setSearchHandler();

    // Load the initial content (Home page)
    const correntUrl = window.location.hash.slice(1).split("?"); // Remove the '#'
    const page = correntUrl?.[0];
    const params = correntUrl?.[1];
    router.navigateTo(page ? page : "home", params);
  });

  function setNavBarHandler() {
    $("nav a").on("click", async function (event) {
      event.preventDefault();
      const pageName = $(this).attr("href");
      await router.navigateTo(pageName);
    });

    window.addEventListener("hashchange", async function () {
      const correntUrl = window.location.hash.slice(1).split("?"); // Remove the '#'
      const page = correntUrl?.[0];
      const params = correntUrl?.[1];
      await router.navigateTo(page, params);
    });
  }

  function setSearchHandler() {
    $("#search-input").on("keyup", async function (event) {
      const search = $(this).val();
      const queryParams = { name: search };
      debounce(() => searchProducts(search), 500);
    });
  }

  async function searchProducts(search) {
    try {
      const response = await $.ajax({
        type: "GET",
        url: `http://localhost:3000/perfumes?search=${search}`,
        dataType: "json",
      });
      // Display search results in the modal
      updateSearchResults(response);
      // Open the modal
      $("#searchResultsModal").modal("show");
      //return response;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function setDialogHandler() {
    // Attach the function to the form's submit event
    $("form#loginForm").on("submit", handleLoginFormSubmit);
    $("form#signupForm").on("submit", handleSignupFormSubmit);
  }

  async function handleLoginFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get values from the form inputs
    var email = $("#email").val();
    var password = $("#password").val();

    if (!email || !password) {
      alert("Invalid email or password.");
      return;
    }

    try {
      await login(email, password);
      updateAuthButtons(); // Update the authentication buttons
      //alert("Login successful!");
      $("#loginModal").modal("hide"); // Close the modal after successful login
      $("#email").val("");
      $("#password").val("");
    } catch (error) {
      alert("Invalid username or password. Please try again.");
      console.error("Error:", error);
    }
  }

  async function login(email, password) {
    // Make an AJAX POST request using async/await
    const response = await $.ajax({
      type: "POST",
      url: "http://localhost:3000/auth/login",
      data: JSON.stringify({ email: email, password: password }),
      contentType: "application/json",
    });

    if (!response.token) {
      throw new Error("missing token");
    }
    // Store the token in local storage
    localStorage.setItem("token", response.token);
  }

  async function handleSignupFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get values from the form inputs
    var name = $("#fullname").val();
    var email = $("#signupEmail").val();
    var password = $("#signupPassword").val();

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Make an AJAX POST request using async/await
      const response = await $.ajax({
        type: "POST",
        url: "http://localhost:3000/auth/register",
        data: JSON.stringify({ name, email, password }),
        contentType: "application/json",
      });

      if (!response) {
        throw new Error("User not returned in the response");
      }

      alert("Sign up successful!");
      $("#fullname").val("");
      $("#signupEmail").val("");
      $("#signupPassword").val("");
      $("#signupModal").modal("hide"); // Close the modal after successful sign up
      await login(email, password);
      updateAuthButtons(); // Update the authentication buttons
      //change to logout button
    } catch (error) {
      if (error.responseJSON && error.responseJSON.message) {
        alert(error.responseJSON.message);
      } else {
        alert("Sign up failed. Please try again.");
      }
      console.error("Error:", error);
    }
  }

  // Function to update authentication buttons based on token existence
  function updateAuthButtons() {
    const token = localStorage.getItem("token");

    if (token) {
      // User is logged in
      $("#loginButton").hide();
      $("#signupButton").hide();
      $("#logoutButton").show();
    } else {
      // User is logged out
      $("#loginButton").show();
      $("#signupButton").show();
      $("#logoutButton").hide();
    }
  }

  function updateSearchResults(results) {
    const searchResultsContainer = $("#searchResults");
    searchResultsContainer.empty();

    if (results.length === 0) {
      searchResultsContainer.html("<p>No results found</p>");
      return;
    }

    const resultList = $("<ul class='list-group'></ul>");

    results.forEach((result) => {
      // Create a list item for each search result
      const id = result["_id"];
      const listItem = `<li class='list-group-item' onclick="router.navigateTo('product', 'id=${id}');">
        <div class='d-flex align-items-center'>
          <img src='${result.image}' class='me-2' alt='${result.name}' style='max-width: 40px;'>
          <div>
            <strong>${result.name}</strong>
            <p class='mb-0'>${result.brand}</p>
          </div>
        </div>
      </li>`;
      resultList.append(listItem);
    });

    searchResultsContainer.append(resultList);
  }
  // Log out functionality
  $("#logoutButton").on("click", function () {
    localStorage.removeItem("token"); // Clear the token from local storage
    localStorage.removeItem("cartItems"); //clear the cart items from local storage
    updateAuthButtons(); // Update the authentication buttons
    router.navigateTo("home");
  });

  let searchTimeout;
  function debounce(func, delay) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(func, delay);
  }
})();

const router = (() => {
  let correntPage;
  let correntParams;

  async function navigateTo(page, params) {
    if (correntPage === page && correntParams === params) {
      return;
    }

    const url = `/clientSide/pages/${page}.html`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.status}`);
      }
      const content = await response.text();
      $("main#content").html(content);

      correntPage = page;
      correntParams = params;
      const urlParams = params ? "?" + params : "";
      window.location.hash = page + urlParams;
    } catch (error) {
      console.error("Error loading content:", error);
    }
  }
  function getParams() {
    return correntParams;
  }
  return {
    navigateTo,
    getParams,
  };
})();
