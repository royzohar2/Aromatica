$(document).ready(async function () {
  const allPerfumes = await fetchAllPerfumes();
  renderPerfumes(allPerfumes);
  setFilterHendlers();
});

function renderPerfumes(perfumes) {
  const perfumeList = $(".perfume-list");
  perfumeList.empty();

  perfumes.forEach((perfume) => {
    const id = perfume["_id"];
    const card = `
    
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${perfume.image}" class="card-img-top" alt="${perfume.name}" onclick="router.navigateTo('product','id=${id}');">
          <div class="card-body">
            <h5 class="card-title">${perfume.name}</h5>
            <p class="card-text">by ${perfume.brand}</p>
            <p class="card-text">Price: $${perfume.price}</p>
            <button class="btn btn-dark">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
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
function setFilterHendlers() {
  $(".filter-option").on("click", function () {
    // Get the name of the clicked checkbox group
    const groupName = $(this).attr("name");
    // Uncheck all checkboxes in the same group except the clicked one
    $(`input[name='${groupName}']`).not(this).prop("checked", false);
  });

  //console.log("document ready products");
  $("#btn-reset-filters").on("click", function () {
    $("input[type='checkbox']").prop("checked", false);
    renderPerfumes(allPerfumes);
  });

  $("#btn-apply-filters").on("click", async function () {
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

      renderPerfumes(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
}
