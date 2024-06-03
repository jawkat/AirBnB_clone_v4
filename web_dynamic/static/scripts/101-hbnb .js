$(document).ready(function() {
    const selectedAmenities = {};

    // Check API status
    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // Handle amenities checkbox changes
    $('input[type="checkbox"]').change(function() {
        if ($(this).is(':checked')) {
            selectedAmenities[$(this).data('id')] = $(this).data('name');
        } else {
            delete selectedAmenities[$(this).data('id')];
        }

        const amenitiesList = Object.values(selectedAmenities).join(', ');
        $('.amenities h4').text(amenitiesList);
    });

    // Handle button click event
    $('button').click(function() {
        // Send POST request to places_search with selected amenities
        $.ajax({
            type: "POST",
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            contentType: "application/json",
            data: JSON.stringify({ amenities: Object.keys(selectedAmenities) }),
            success: function(data) {
                // Loop through the result and create article tags representing places
                $('.places').empty(); // Clear existing places
                $.each(data, function(index, place) {
                    // Create article tag for each place and append it to section.places
                    var article = '<article>';
                    article += '<div class="title_box"><h2>' + place.name + '</h2><div class="price_by_night">$' + place.price_by_night + '</div></div>';
                    article += '<div class="information"><div class="max_guest">' + place.max_guest + ' Guest';
                    if (place.max_guest != 1) {
                        article += 's';
                    }
                    article += '</div><div class="number_rooms">' + place.number_rooms + ' Bedroom';
                    if (place.number_rooms != 1) {
                        article += 's';
                    }
                    article += '</div><div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom';
                    if (place.number_bathrooms != 1) {
                        article += 's';
                    }
                    article += '</div></div><div class="description">' + place.description + '</div></article>';
                    $('.places').append(article);
                });
            }
        });
    });

    // Handle reviews toggle
    $('.toggle-reviews').click(function() {
        const status = $(this).data('status');
        if (status === 'show') {
            // Fetch and display reviews
            $.get('http://0.0.0.0:5001/api/v1/reviews', function(data) {
                const reviews = data.map(review => '<p>' + review.text + '</p>');
                $('.reviews').html(reviews.join(''));
            });
            $(this).text('hide').data('status', 'hide');
        } else {
            // Hide reviews
            $('.reviews').empty();
            $(this).text('show').data('status', 'show');
        }
    });
});
