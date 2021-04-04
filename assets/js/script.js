// get current date
function getNow() {
    // get current date
    var today = new Date();
    // extract month
    var month = today.getMonth() + 1;
    // extract day
    var day = today.getDate();
    // date object
    var date = {
        month: month,
        day: day
        };

    // send date to get factoid API call        
    getFactoid( date );
};

// get factoid API call
function getFactoid( date ) {  
    // set api url
    var apiUrl = `https://byabbe.se/on-this-day/${date.month}/${date.day}/events.json`;
        // fetch
        fetch(apiUrl).then(function(response) {
            //success
            if (response.ok) {
            response.json().then(function(data) {
                // build beer object
                parseFactoid( data )
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

// build factoid object
function parseFactoid( data ) {
    // choose random event
    var allEvents = data.events;
    // choose a random number between 0 and the length of the events list
    var random = Math.floor( Math.random() * allEvents.length );
    // set factoid object
    var factoid = data.events[ random ]
    // init output object
    var output = {}
    // set output properties
    output.description = factoid.description;
    output.year = factoid.year

    // console for viewing
    console.log( output )

    // retun output object
    return output
};

// get beer API call
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

// get cocktail API call
function getCocktail() {
    //url already set by DB, set as variable
    var randomDrinkUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
    //fetch it
    fetch(randomDrinkUrl).then(function(response) {

        //if comes back ok
        if (response.ok) {
        response.json().then(function(data) {
            // put into object to pull from later
            parseRandomDrink (data)
        });
        // if fail
        } else {
            error()
        }
    })

    // catch
    .catch( function (error) {
        error()
    })

};

function parseRandomDrink (data) {
    //create object to match parse functions above
    var randomDrinkOutput = {}
    randomDrinkOutput.name = data.drinks[0].strDrink;
    randomDrinkOutput.image = data.drinks[0].strDrinkThumb;
    randomDrinkOutput.directions = data.drinks[0].strInstructions;

    // init recipe array
    var recipe = []

    // loop from 0 to 14
    for ( var i = 0; i < 15; i++) {
        // init ingredient and measure
        var ingredient, measure
        // if ingredient exists, set variable
        if( data.drinks[0][`strIngredient${i+1}`] ) {
            // set ingredient var
            ingredient = data.drinks[0][`strIngredient${i+1}`]
            // if measure exists, set, else use 'to taste'
            if( data.drinks[0][`strMeasure${i+1}`] ) {
                measure = data.drinks[0][`strMeasure${i+1}`]
            } else {
                measure = 'To taste'
            }
            // create object of each ingredient set
            var step = {
                ingredient: ingredient,
                measure: measure
            }
            recipe[i] = step
        }   
    }
    // add recipe property
    randomDrinkOutput.recipe = recipe

    //log the new object
    console.log( randomDrinkOutput );
};

// error function
function error( ) {
    console.log( 'error' )
}

// run historical factoid function
getNow();

// run the get beer function
getBeer();

// run the get cocktail function
getCocktail();
//await click for randomize function.  Once clicked, run randomBtnHandler function
// userFormEl.addEventListener("submit", randomBtnHandler);
