$(document).ready(function () {
  setDialogHandler();
  setNavBarHandler();

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
}

async function handleLoginFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get values from the form inputs
  var username = $("#username").val();
  var password = $("#password").val();

  if (!username || !password) {
    alert("Invalid username or password.");
    return;
  }

  try {
    // Make an AJAX POST request using async/await
    const response = await $.ajax({
      type: "POST",
      url: "http://localhost:3000/auth/login", // Replace with your actual API endpoint
      data: JSON.stringify({ email: username, password: password }),
      contentType: "application/json",
    });

    if (!response.token) {
      throw new Error("missing token");
    }

    alert("Login successful!");
    $("#loginModal").modal("hide"); // Close the modal after successful login
    //change to logout button
  } catch (error) {
    alert("Invalid username or password. Please try again.");
    console.error("Error:", error);
  }
}
