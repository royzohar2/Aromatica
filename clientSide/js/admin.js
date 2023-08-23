
$(document).ready(function () {
    const token = localStorage.getItem("token");

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
                $('.admin-content').on('click', '.edit-button', function () {
                    var perfumeId = $(this).data('perfume-id');
                    loadEditPerfumeForm(perfumeId);
                });
                $('.admin-content').on('click', '.delete-button', function () {
                    var perfumeId = $(this).data('perfume-id');
                    deletePerfume(perfumeId);
                });
                $('.admin-content').append("<button id='newperfume' class='btn btn-primary edit-button ml-2'>New Perfume</button>");
                $('#newperfume').click(function () {
                    console.log("New Perfume clicked");
                    loadPerfumeForm("");
                });
            },
            error: function (error) {
                console.error("Error fetching perfume data:", error);
            }
        });
    
    });

    $('#client').click(function () {
        $.ajax({
            url: "http://localhost:3000/account",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: function (data) {

                var content = "<h3>" + "clients" + " Content</h3>";
                content += "<table class='table table-bordered'>";
                content += "<thead>";
                content += "<tr>";
                content += "<th>Name</th>";
                content += "<th>Email</th>";
                content += "<th>Roles</th>";
                content += "<th>Orders</th>";
                content += "<th>Actions</th>"; // Add a column for the buttons
                content += "</tr>";
                content += "</thead>";
                content += "<tbody>";

                data.forEach(function (client) {
                    content += "<tr>";
                    content += "<td>" + client.name + "</td>";
                    content += "<td>" + client.email + "</td>";
                    content += "<td>" + client.roles + "</td>";
                    //content += "<td>" + client.orders + "</td>";
                    var orderRow = ""
                    client.orders.forEach(function(order) {
                        console.log(order);
                        orderRow +=  order + "\n";
         
                    });
                    content += "<td>" + orderRow + "</td>";

                    content += "<td><button class='btn btn-danger delete-button' data-client-id='" + client._id + "'>Delete</button>";
                    content += "<button class='btn btn-primary edit-button ml-2' data-client-id='" + client._id + "'>Edit</button></td>";

                    content += "</tr>";
                });

                content += "</tbody>";
                content += "</table>";
                $('.admin-content').html(content);
                $('.admin-content').on('click', '.edit-button', function () {
                    var clientId = $(this).data('client-id');
                    loadEditClientForm(clientId);
                });
                $('.admin-content').on('click', '.delete-button', function () {
                    var clientId = $(this).data('client-id');
                    deleteClient(clientId);
                });        
                // $('.admin-content').append("<button id='newclient' class='btn btn-primary ml-2'>New client</button>");
                // $('#newclient').click(function () {
                //     loadClientForm("");
                // });
            },
            error: function (error) {
                console.error("Error fetching client data:", error);
            }
        });
    });

    ///////////////////////////////////// perfume ////////////////////////////////////
    function deletePerfume(perfumeId) {
        $.ajax({
            url: "http://localhost:3000/perfumes", // Update the URL as needed
            method: "DELETE",
            data: { id: perfumeId }, // Send the perfume ID to the server
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: function () {
                $('#product').click();
            },
            error: function (error) {
                console.error("Error deleting perfume:", error);
            }
        });
    }
    
    function loadEditPerfumeForm(perfumeId) {
        // Make an AJAX request to fetch perfume data
        $.ajax({
            url: `http://localhost:3000/perfumes/${perfumeId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: function(data) {
                console.log(data);
                loadPerfumeForm(data)
            },
            error: function(error) {
                console.log('Error loading perfume data:', error);
            }
        });
    }
   
    function loadPerfumeForm(data) {

        if (data == ""){
            var editModal = $('#editModal');   
            // Populate form fields with the fetched data
            $('#perfumeName').val("");
            $('#perfumeBrand').val('');
            $('#perfumeImage').val("");
            $('#perfumePrice').val("");
            $('#perfumeCategory').val("");

            // Update the placeholders using the val() method
            $('#perfumeName').attr('placeholder', 'Enter perfume name');
            $('#perfumeBrand').attr('placeholder', 'Enter perfume brand');
            $('#perfumeImage').attr('placeholder', 'Enter image URL');
            $('#perfumePrice').attr('placeholder', 'Enter perfume price');
            $('#perfumeCategory').attr('placeholder','Enter perfume category');
         
            editModal.modal('show');
        }
        else {
            var editModal = $('#editModal');
            var editModalContent = editModal.find('.modal-content');
            $('#productIdContainer').text(data._id);
            $('#perfumeName').val(data.name);
            $('#perfumeBrand').val(data.brand);
            $('#perfumeImage').val(data.image);
            $('#perfumePrice').val(data.price);
            $('#perfumeCategory').val(data.category);

            // Populate form fields with the fetched data
            $('#perfumeName').attr('placeholder', data.name);
            $('#perfumeBrand').attr('placeholder', data.brand);
            $('#perfumeImage').attr('placeholder',  data.image);
            $('#perfumePrice').attr('placeholder',  data.price );
            $('#perfumeCategory').attr('placeholder',data.category);

            
            editModal.modal('show');
            
        }
    }
    
    $('#saveChangesProduct').on('click', function() {
        // Get the edited form data
        var productId = $('#productIdContainer').text();
        if(productId == ""){
            console.log("1" , productId);
            var editedData = {
                    name: $('#perfumeName').val(),
                    brand: $('#perfumeBrand').val(),
                    image: $('#perfumeImage').val(),
                    price: $('#perfumePrice').val(),
                    category: $('#perfumeCategory').val(),
                    numberOfPurchase: 1,
                    id: 0
                    // Get other form field values similarly
            };

            // Send the edited data to the server using AJAX
            $.ajax({
                url: 'http://localhost:3000/perfumes', // Update with your server endpoint
                method: 'POST',
                data: editedData,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                success: function(response) {
                    console.log('Data saved successfully:', response);
                    // Close the modal or perform any other actions
                    $('#editModal').modal('hide');
                    $('#product').click();
                },
                error: function(error) {
                    console.log('Error saving data:', error);
                }
            });

        }
        else{
            var editedData = {
                id: productId,
                perfume : {
                    name: $('#perfumeName').val(),
                    brand: $('#perfumeBrand').val(),
                    image: $('#perfumeImage').val(),
                    price: $('#perfumePrice').val(),
                    category: $('#perfumeCategory').val()

                    // Get other form field values similarly
            }
            };

            // Send the edited data to the server using AJAX
            $.ajax({
                url: 'http://localhost:3000/perfumes', // Update with your server endpoint
                method: 'PATCH',
                data: editedData,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                success: function(response) {
                    console.log('Data saved successfully:', response);
                    // Close the modal or perform any other actions
                    $('#editModal').modal('hide');
                    $('#product').click();
                },
                error: function(error) {
                    console.log('Error saving data:', error);
                }
            });
        }
    });

/////////////////////////////////////////////// client //////////////////////////////////////////////

function deleteClient(clientId) {
    console.log(clientId);
    $.ajax({
        url: `http://localhost:3000/account/delete`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: { id: clientId},
        success: function () {
            $('#client').click();
        },
        error: function (error) {
            console.error("Error deleting client:", error);
        }
    });
}

function loadEditClientForm(clientId) {
    // Make an AJAX request to fetch client data
    console.log(clientId);
    $.ajax({
        url: `http://localhost:3000/account/${clientId}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: function(data) {
            console.log('1');
            loadClientForm(data);
        },
        error: function(error) {
            console.log('Error loading client data:', error);
        }
    });
}

function loadClientForm(data) {
    var editModal = $('#editClientModal');

    if (!data) {
        // If no data is provided, it's a new client
        // Clear the form fields
        $('#clientName').val("");
        $('#clientEmail').val('');
        $('#clientRoles').val([]);


        // Show the modal
        editModal.modal('show');
    } else {
        // Populate form fields with the fetched data
        $('#clientIdContainer').text(data._id);
        $('#clientName').val(data.name);
        $('#clientEmail').val(data.email);
        $('#clientRoles').val(data.roles);
        $('#clientName').attr('placeholder',data.name);
        $('#clientEmail').attr('placeholder',data.email);
        $('#clientRoles').attr('placeholder',data.roles);



        // Show the modal
        editModal.modal('show');
    }
}

$('#saveChangesClient').on('click', function() {
    var clientId = $('#clientIdContainer').text();
    var editedData = {
        id: clientId,
        user: {
            name: $('#clientName').val(),
            email: $('#clientEmail').val(),
            roles: $('#clientRoles').val()
        }
    };

    // Update an existing client
    $.ajax({
        url: `http://localhost:3000/account/update`,
        method: 'PATCH',
        data: editedData,
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: function(response) {
            console.log('Client updated successfully:', response);
            $('#editClientModal').modal('hide');
            $('#client').click();
        },
        error: function(error) {
            console.log('Error updating client:', error);
        }
    });
    
});




});