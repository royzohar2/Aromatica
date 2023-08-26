
$(document).ready(function () {
    const token = localStorage.getItem("token");
    $('#statistics').on('click', async function () {
        router.navigateTo("statistics")
    });
    /////////////////////////// product /////////////////////////////////////
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
                    content += "<td>₪" + perfume.price + "</td>";
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
    /////////////////////////// client /////////////////////////////////////

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
                    console.log(client.roles);
                    content += "<tr>";
                    content += "<td>" + client.name + "</td>";
                    content += "<td>" + client.email + "</td>";
                    content += "<td>" + client.roles + "</td>";
                    //content += "<td>" + client.orders + "</td>";
                    var orderRow = ""
                    client.orders.forEach(function(order) {
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
        /////////////////////////// order /////////////////////////////////////

    $('#order').click(function () {
        $.ajax({
            url: "http://localhost:3000/order/all",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: function (data) {
                console.log("11");

                var content = "<h3>Orders Content</h3>";
                content += "<table class='table table-bordered'>";
                content += "<thead>";
                content += "<tr>";
                content += "<th>User</th>";
                content += "<th>Total Amount</th>";
                content += "<th>Product Names</th>"; // New column for product names
                content += "<th>Order Date</th>";
                content += "<th>Actions</th>";
                content += "</tr>";
                content += "</thead>";
                content += "<tbody>";
        
                var count = 0;
        
                data.forEach(function (order, index) {
                    content += "<tr>";
                    $.ajax({
                        url: "http://localhost:3000/account/" + order.user,
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        success: function (userData) {
                            var productNamesPromise = Promise.all(order.products.map(productId => (
                                $.ajax({
                                    url: "http://localhost:3000/perfumes/" + productId,
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    },
                                    error: function (error) {
                                        console.error("Error fetching prefume data:", productId);
                                    }
                                })
                            )));
                            productNamesPromise.then(productDataArray => {
                                var productNames = productDataArray.map(productData => `${productData.name} - (${productData.brand})\n`).join(',');
        
                                content += "<td>" + userData.name + "</td>";
                                content += "<td>" + order.totalAmount + "</td>";
                                content += "<td>" + productNames + "</td>"; // Display product names with brands
                                content += "<td>" + new Date(order.orderDate).toLocaleString() + "</td>";
                                content += "<td>";
                                content += "<button class='btn btn-danger delete-order' data-order-id='" + order._id + "'>Delete</button>";
                                content += "<button class='btn btn-primary edit-order ml-2' data-order-id='" + order._id + "'>Edit</button>";
                                content += "</td>";
                                content += "</tr>";
                                count++;
        
                                if (count === data.length) {
                                    // Once all user data is fetched and processed, update the content
                                    content += "</tbody>";
                                    content += "</table>";
                                    $('.admin-content').html(content);
        
                                    // Attach event handlers for edit and delete buttons
                                    $('.admin-content').on('click', '.edit-order', function () {
                                        var orderId = $(this).data('order-id');
                                        loadEditOrderForm(orderId);
                                    });
                                    $('.admin-content').on('click', '.delete-order', function () {
                                        var orderId = $(this).data('order-id');
                                        deleteOrder(orderId);
                                    });
                                }
                            }).catch(error => {
                                console.error("Error fetching product data:", error);
                            });
                        },
                        error: function (error) {
                            console.error("Error fetching user data:", error);
                        }
                    });
                });
            },
            error: function (error) {
                console.error("Error fetching order data:", error);
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
                roles: $('#clientRoles').val().split(',')
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


////////////////////////////// orders //////////////////////////
function deleteOrder(orderId) {
    $.ajax({
        url: "http://localhost:3000/order" ,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: { id: orderId},
        success: function (response) {
            $('#order').click();

        },
        error: function (error) {
            console.error("Error deleting order:", error);
        }
    });
}



function loadEditOrderForm(orderId) {
    // Fetch order details and products
    $.ajax({
        url: "http://localhost:3000/order/" + orderId,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: function (orderData) {
            // Populate the edit order modal with order details and products
            populateEditOrderModal(orderData);
            
            // Show the edit order modal
            $('#editOrderModal').modal('show');
        },
        error: function (error) {
            console.error("Error fetching order data:", error);
        }
    });
}

function populateEditOrderModal(orderData) {
    var modal = $('#editOrderModal');
    modal.find('.order-details').html(`<h5>Order id : ${orderData._id}</h5><h5>choose product to remove</h5>`);
    
     
    var productCheckboxes = '';
    
    // Fetch product data for each product in the order
    var productPromises = orderData.products.map(productId => (
        $.ajax({
            url: "http://localhost:3000/perfumes/" + productId,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    ));
    
    Promise.all(productPromises)
        .then(productDataArray => {
            productDataArray.forEach(productData => {
                productCheckboxes += `
                    <label>
                        <input type="checkbox" name="removedProducts" value="${productData._id}">
                        ${productData.name} (${productData.brand} - ${productData._id})
                    </label><br>`;
            });
            modal.find('.product-list').html(productCheckboxes);
            
            // Attach event handler to "Update Order" button
            modal.find('#updateOrder').on('click', function () {
                // Get selected products to remove
                var removedProducts = modal.find('input[name="removedProducts"]:checked')
                    .map(function () {
                        return $(this).val();
                    })
                    .get();
                // Call a function to update the order with removed products
                updateOrderWithRemovedProducts(orderData._id,orderData.products , removedProducts);
                
                // Close the modal
                modal.modal('hide');
                $('#order').click();

            });
        })
        .catch(error => {
            console.error("Error fetching product data:", error);
        });
}

function updateOrderWithRemovedProducts(orderId, allProducts, removedProducts) {

    // Create a map to keep track of product IDs and their counts
    var productCountMap = {};
    allProducts.forEach(product => {
        if (!productCountMap[product]) {
            productCountMap[product] = 1;
        } else {
            productCountMap[product]++;
        }
    });

    // Create the updated products list while keeping only one instance of each product
    var updatedProducts = allProducts.filter(product => {
        if (removedProducts.includes(product) && productCountMap[product] > 0) {
            productCountMap[product]--;
            return false; // Exclude the product from the updated list
        }
        return true;
    });    
    if (updatedProducts == [] ){
        deleteOrder(orderId)
    }
    else {
        var productPricePromises = updatedProducts.map(product => (
            $.ajax({
                url: "http://localhost:3000/perfumes/" + product,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        ));
        // Once we have fetched all product prices
        Promise.all(productPricePromises)
            .then(productDataArray => {
                
                var totalPriceSum = 0;
                for (var i = 0; i < productDataArray.length; i++) {
                    totalPriceSum += productDataArray[i].price;
                }
                
                // Rest of the code to update the order...
            


            var updatedOrder = {
                        id: orderId , 
                        order : {
                        products: updatedProducts,
                        totalAmount: totalPriceSum
                        }
            };
            $.ajax({
                    url: "http://localhost:3000/order" ,
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: updatedOrder,
                    error: function (error) {
                        console.error("Error updating order:", error);
                    }
                });

            });
        }
    }



});