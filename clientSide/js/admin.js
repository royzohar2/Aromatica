
$(document).ready(function () {
    const token = localStorage.getItem("token");
    console.log("1")

    $('#product').click(function () {
        console.log("2") 
        $.ajax({
            url: "http://localhost:3000/perfumes",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: function (data) {
                var content = "<h3>" + "product" + " Content</h3>";
                content += "<table class='table table-bordered'>";
                content += "<thead>";
                content += "<tr>";
                content += "<th>Image</th>";
                content += "<th>Name</th>";
                content += "<th>Brand</th>";
                content += "<th>Price</th>";
                content += "<th>Number of Purchases</th>";
                content += "<th>Category</th>";
                content += "<th>Actions</th>"; // Add a column for the buttons
                content += "</tr>";
                content += "</thead>";
                content += "<tbody>";

                data.forEach(function (perfume) {
                    content += "<tr>";
                    content += "<td><img src='" + perfume.image + "' alt='" + perfume.name + "' class='perfume-image'></td>";
                    content += "<td>" + perfume.name + "</td>";
                    content += "<td>" + perfume.brand + "</td>";
                    content += "<td>$" + perfume.price + "</td>";
                    content += "<td>" + perfume.numberOfPurchase + "</td>";
                    content += "<td>" + perfume.category + "</td>";

                    content += "<td><button class='btn btn-danger delete-button' data-perfume-id='" + perfume._id + "'>Delete</button>";
                    content += "<button class='btn btn-primary edit-button ml-2' data-perfume-id='" + perfume._id + "'>Edit</button></td>";

                    content += "</tr>";
                });

                content += "</tbody>";
                content += "</table>";
                $('.admin-content').html(content);
                $('.edit-button').click(function () {
                    var perfumeId = $(this).data('perfume-id');
                    loadEditForm(perfumeId);
                });

                $('.delete-button').click(function () {
                    var perfumeId = $(this).data('perfume-id');
                    deletePerfume(perfumeId);
                });
            },
            error: function (error) {
                console.error("Error fetching perfume data:", error);
            }
        });
    
    });


    function deletePerfume(perfumeId) {
        $.ajax({
            url: "http://localhost:3000/perfumes", // Update the URL as needed
            method: "DELETE",
            data: { id: perfumeId }, // Send the perfume ID to the server
            success: function () {
                // Reload the table after successful delete
                loadAdminContent("perfume");
            },
            error: function (error) {
                console.error("Error deleting perfume:", error);
            }
        });
    }
    
    function loadEditForm(perfumeId) {
        var editModal = $('#editModal');
        var editModalContent = editModal.find('.modal-content'); // Get the modal content container
    
        // Fetch the HTML template using AJAX
        $.ajax({
            url: 'editModalContent.html', // Update the URL to match your file path
            method: 'GET',
            success: function (htmlTemplate) {
                // Set the fetched HTML as the content of the modal content container
                editModalContent.html(htmlTemplate);
    
                // Get the form fields within the modal
                var editNameField = editModal.find('#editName');
                // Add more fields as needed
    
                // Fetch perfume data using getPerfumeById function
                getPerfumeById(perfumeId)
                    .then(function (perfume) {
                        // Populate the modal form with existing data
                        editNameField.val(perfume.name);
                        // Populate other form fields similarly
    
                        // Show the modal
                        editModal.modal('show');
                    })
                    .catch(function (error) {
                        console.error("Error fetching perfume data:", error);
                    });
            },
            error: function (error) {
                console.error("Error fetching HTML template:", error);
            }
        });
    }
    
    

    async function getPerfumeById(perfumeId) {
        const token = localStorage.getItem("token");
    
        try {
            const response = await $.ajax({
                url: `http://localhost:3000/perfumes/${perfumeId}`, // Update the URL to match your server's route
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            return response; // Return the retrieved data
        } catch (error) {
            console.error("Error fetching perfume data:", error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }
    



 

    function deletePerfume(perfumeId) {
        // ... rest of the deletePerfume function (as previously provided)
    }
});



// function loadEditForm(perfumeId) {
//     $.ajax({
//         url: `http://localhost:3000/perfumes/${perfumeId}`,
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${token}`
//         },
//         success: function (data) {

//             var modalContent = "<div class='modal-dialog' role='document'>";
//             modalContent += "<div class='modal-content'>";
//             modalContent += "<div class='modal-header'>";
//             modalContent += "<h5 class='modal-title' id='editModalLabel'>Edit Perfume Information</h5>";
//             modalContent += "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>";
//             modalContent += "<span aria-hidden='true'>&times;</span>";
//             modalContent += "</button>";
//             modalContent += "</div>";
//             modalContent += "<div class='modal-body'>";
//             modalContent += "<form id='editForm'>";
//             modalContent += "<label for='editName'>Name</label>";
//             modalContent += "<input type='text' id='editName' class='form-control' placeholder='Perfume Name' value='" + perfume.name + "'>";
//             // Add more form fields for other properties and populate them with existing data
//             modalContent += "</form>";
//             modalContent += "</div>";
//             modalContent += "<div class='modal-footer'>";
//             modalContent += "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>";
//             modalContent += "<button type='button' class='btn btn-primary' id='updatePerfumeButton'>Save Changes</button>";
//             modalContent += "</div>";
//             modalContent += "</div>";
//             modalContent += "</div>";
        
//             editModal.html(modalContent);
//             editModal.modal('show');
//                              // Add listener for the "Save Changes" button within the modal
//             editModal.find('#updatePerfumeButton').click(function () {
//                 var updatedData = {
//                     name: $('#editName').val(),
//                     // Extract other updated data from form fields
//                 };
//                 updatePerfume(perfumeId, updatedData);
//                 editModal.modal('hide');
//             });
//             function updatePerfume(perfumeId, updatedData) {
//                 $.ajax({
//                     url: "http://localhost:3000/perfumes/" + perfumeId,
//                     method: "PUT",
//                     data: updatedData,
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     },
//                     success: function () {
//                         loadAdminContent("product");
//                     },
//                     error: function (error) {
//                         console.error("Error updating perfume:", error);
//                     }
//                 });
//             }
//         },
//         error: function (error) {
//             console.error("Error update perfume data:", error);
//         }
    
//     });