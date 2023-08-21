$(document).ready(function () {
  setDialogHandler();
  setNavBarHandler();
  updateAuthButtons(); // Update the authentication buttons on page load

  // Load the initial content (Home page)
  const correntPage = window.location.hash.slice(1); // Remove the '#'
  navigateTo(correntPage ? correntPage : "home");
});

async function navigateTo(page) {
  const url = `/clientSide/pages/${page}.html`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }
    const content = await response.text();
    $("main#content").html(content);
    window.location.hash = page;
  } catch (error) {
    console.error("Error loading content:", error);
  }
  // Add event handler for "Buy Now" button on home page
  if (page === "home") {
    $("#content").on("click", "#buyNowButton", async function () {
      // Redirect to the dynamically generated products.html page
      await navigateTo("products");
    });
  }
}

function setNavBarHandler() {
  $("nav a").on("click", async function (event) {
    event.preventDefault();
    const pageName = $(this).attr("href");
    await navigateTo(pageName);
  });

  window.addEventListener("hashchange", async function () {
    const currentPath = window.location.hash.slice(1); // Remove the '#'
    await navigateTo(currentPath);
  });
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

    //alert("Login successful!");
    $("#loginModal").modal("hide"); // Close the modal after successful login
    updateAuthButtons(); // Update the authentication buttons
  } catch (error) {
    alert("Invalid username or password. Please try again.");
    console.error("Error:", error);
  }
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
    $("#signupModal").modal("hide"); // Close the modal after successful sign up
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

// Log out functionality
$("#logoutButton").on("click", function () {
  localStorage.removeItem("token"); // Clear the token from local storage
  updateAuthButtons(); // Update the authentication buttons
});
