function getBeer( data ) {
    
    // set api url
    var apiUrl = `https://api.punkapi.com/v2/beers/random`;
        // fetch
        fetch(apiUrl).then(function(response) {
            //success
            if (response.ok) {
            response.json().then(function(data) {
                // build beer object
                parseBeer( data )
            });
            // fail
            } else {
                error()
            }
        })
        // catch
        .catch( function ( error ) {
            error()
        });
};

// build beer object
function parseBeer( data ) {
    // init object
    var output = {}
    // set object attributes
    output.name = data[0].name;
    output.tagline = data[0].tagline;
    output.image = data[0].image_url;
    output.foodpairing = data[0].food_pairing
    output.abv = data[0].abv;
    // console for viewing
    console.log(output)
    // retun output object
    return output
};

// error function
function error( ) {
    console.log( 'error' )
}

// run the get beer function
getBeer();

