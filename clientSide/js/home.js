(() => {
  $(document).ready(function () {
    $("#buyNowButton").on("click", async function () {
      // Redirect to the dynamically generated products.html page
      router.navigateTo("products");
    });
  });
})();

function loadMapScenario() {
  const map = new Microsoft.Maps.Map(document.getElementById("myMap"), {
    credentials:
      "AhbHpn13YRQEN93y_F3F-z5p5El_ta8Z3J-nmkisRk6FYy49mkG0kRcHLnMluuDH",
    center: new Microsoft.Maps.Location(31.976558346816635, 34.79229679875419), // Default location
    zoom: 10, // Default zoom level
  });

  // Fetch points from your server using an AJAX request
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/point",
    dataType: "json",
    success: function (response) {
      //console.log(response);
      // Loop through the points and add them as pushpins on the map
      response.forEach(function (point) {
        //console.log(point);
        const location = new Microsoft.Maps.Location(
          point.latitude,
          point.longitude
        );
        //console.log(location);
        const pushpin = new Microsoft.Maps.Pushpin(location, {
          title: point.name,
        });
        map.entities.push(pushpin);
      });
    },
    error: function (error) {
      console.error("Error fetching points:", error);
    },
  });
}
