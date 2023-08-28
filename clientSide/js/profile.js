

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  function getUserRole() {
      return new Promise((resolve, reject) => {
          var token = localStorage.getItem("token");
          const decodedToken = parseJwt(token);
          var userId = decodedToken.userId;
            console.log(userId);
          $.ajax({
              url: `http://localhost:3000/account/${userId}`,
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${token}`
              },
              success: function(data) {
                  resolve(data.roles.length);
              },
              error: function() {
                  reject(new Error('Error fetching user profile information.'));
              }
          });
      });
  }  



$(document).ready(function() {
    getUserRole()
        .then(rolesLength => {
            console.log(rolesLength);

            // Now you can use rolesLength to determine if the user is an admin
            if (rolesLength > 1) {
                $('#adminPageBtn').show(); // Show the button for admins
            } else {
                $('#adminPageBtn').hide(); // Hide the button for non-admins
            }

        })
        .catch(error => {
            console.log(error.message);
        });



    $('#adminPageBtn').on('click', async function () {
        router.navigateTo("admin")
    });
    $('#userInfoBtn').click(function() {
        var token = localStorage.getItem("token");
        console.log(token);
        const decodedToken = parseJwt(token);
        console.log('Decoded Token:', decodedToken);
        var userId = decodedToken.userId;
        console.log(userId);

        $.ajax({
            url: `http://localhost:3000/account/${userId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: function(data) {
                var userInfoHtml = "<div class='card-header'>User Information</div>";
                userInfoHtml += "<div class='card-body'>";
                userInfoHtml += "<div class='profile-box'>";
                userInfoHtml += "<label for='name'>Name:</label>";
                userInfoHtml += "<div>" + data.name + "</div>";
                userInfoHtml += "</div>";
                userInfoHtml += "<div class='profile-box'>";
                userInfoHtml += "<label for='email'>Email:</label>";
                userInfoHtml += "<div>" + data.email + "</div>";
                userInfoHtml += "</div>";
                userInfoHtml += "<div class='profile-box'>";
                userInfoHtml += "<label for='role'>Role:</label>";
                userInfoHtml += "<div>" + data.roles.join(', ') + "</div>";
                userInfoHtml += "</div>";
                userInfoHtml += "</div>";
                userInfoHtml += "</div>";
                
                $('#userInfoContainer').html(userInfoHtml);
            },
            error: function() {
                console.log('Error fetching user profile information.');
            }
        });    
    });

    $(document).ready(function() {
        $('#orderHistoryBtn').click(function() {
            var token = localStorage.getItem("token");
            const decodedToken = parseJwt(token);
            var userId = decodedToken.userId;
    
            $.ajax({
                url: `http://localhost:3000/account/${userId}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                success: function(userData) {
                    var userOrders = userData.orders;
    
                    var orderTable = $("<table class='order-table'>");
                    orderTable.append("<tr><th>Order ID</th><th>Order Date</th><th>Products</th><th>Total Amount</th></tr>");
    
                    userOrders.forEach(function(orderId) {
                        $.ajax({
                            url: `http://localhost:3000/order/${orderId}`,
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            success: function(orderData) {
                                // Fetch product details for each product in the order
                                var productPromises = orderData.products.map(function(productId) {
                                    return $.ajax({
                                        url: `http://localhost:3000/perfumes/${productId}`,
                                        method: 'GET',
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    });
                                });
    
                                Promise.all(productPromises)
                                    .then(function(products) {
                                        var productNames = products.map(function(product) {
                                            return product.name;
                                        }).join(", ");
    
                                        var orderRow = $("<tr>");
                                        orderRow.append("<td>" + orderData._id + "</td>");
                                        orderRow.append("<td>" + new Date(orderData.orderDate).toLocaleString() + "</td>");
                                        orderRow.append("<td>" + productNames + "</td>");
                                        orderRow.append("<td>" + orderData.totalAmount + "</td>");
    
                                        orderTable.append(orderRow);
                                    })
                                    .catch(function(error) {
                                        console.log('Error fetching product details:', error);
                                    });
                            },
                            error: function() {
                                console.log('Error fetching order details.');
                            }
                        });
                    });
    
                    // Append the order table to the userInfoContainer
                    $('#userInfoContainer').html(orderTable);
                },
                error: function() {
                    console.log('Error fetching user information.');
                }
            });
        });
    });
    
    
});