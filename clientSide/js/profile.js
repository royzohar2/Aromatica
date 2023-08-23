$(document).ready(function() {
    // Handler for User Info button click
    $('#userInfoBtn').click(function() {
        var token = localStorage.getItem("token");
        var userId = localStorage.getItem("userId"); // Get the user ID from local storage

        $.ajax({
            url: `http://localhost:3000/account/${userId}`, // Use the user ID to construct the URL
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
});





