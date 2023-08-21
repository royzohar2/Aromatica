$(document).ready(function() {
    // Fetch user profile information from the server using AJAX
    $.ajax({
        url: '/api/user-profile', // Update the URL to your API endpoint
        method: 'GET',
        success: function(data) {
            $('#nameBox').text(data.name);
            $('#emailBox').text(data.email);
            $('#roleBox').text(data.roles.join(', ')); // Assuming roles is an array
        },
        error: function() {
            console.log('Error fetching user profile information.');
        }
    });
});
