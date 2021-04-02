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

//function to randomly generate a cocktail drink
function randomBtnHandler() {
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
    randomDrinkOutput.measure1 = data.drinks[0].strMeasure1;
    randomDrinkOutput.measure2 = data.drinks[0].strMeasure2;
    randomDrinkOutput.measure3 = data.drinks[0].strMeasure3;
    randomDrinkOutput.measure4 = data.drinks[0].strMeasure4;
    randomDrinkOutput.measure5 = data.drinks[0].strMeasure5;
    randomDrinkOutput.measure6 = data.drinks[0].strMeasure6;
    randomDrinkOutput.measure7 = data.drinks[0].strMeasure7;
    randomDrinkOutput.measure8 = data.drinks[0].strMeasure8;
    randomDrinkOutput.measure9 = data.drinks[0].strMeasure9;
    randomDrinkOutput.measure10 = data.drinks[0].strMeasure10;
    randomDrinkOutput.measure11 = data.drinks[0].strMeasure11;
    randomDrinkOutput.measure12 = data.drinks[0].strMeasure12;
    randomDrinkOutput.measure13 = data.drinks[0].strMeasure13;
    randomDrinkOutput.measure14 = data.drinks[0].strMeasure14;
    randomDrinkOutput.measure15 = data.drinks[0].strMeasure15;
    randomDrinkOutput.ingredient1 = data.drinks[0].strIngredient1;
    randomDrinkOutput.ingredient2 = data.drinks[0].strIngredient2;
    randomDrinkOutput.ingredient3 = data.drinks[0].strIngredient3;
    randomDrinkOutput.ingredient4 = data.drinks[0].strIngredient4;
    randomDrinkOutput.ingredient5 = data.drinks[0].strIngredient5;
    randomDrinkOutput.ingredient6 = data.drinks[0].strIngredient6;
    randomDrinkOutput.ingredient7 = data.drinks[0].strIngredient7;
    randomDrinkOutput.ingredient8 = data.drinks[0].strIngredient8;
    randomDrinkOutput.ingredient9 = data.drinks[0].strIngredient9;
    randomDrinkOutput.ingredient10 = data.drinks[0].strIngredient10;
    randomDrinkOutput.ingredient11 = data.drinks[0].strIngredient11;
    randomDrinkOutput.ingredient12 = data.drinks[0].strIngredient12;
    randomDrinkOutput.ingredient13 = data.drinks[0].strIngredient13;
    randomDrinkOutput.ingredient14 = data.drinks[0].strIngredient14;
    randomDrinkOutput.ingredient15 = data.drinks[0].strIngredient15;
    randomDrinkOutput.directions = data.drinks[0].strInstructions;
    //log the new object
    console.log(randomDrinkOutput);
}
// run historical factoid function
getNow();

// run the get beer function
getBeer();

//for the time being, running function to console log
randomBtnHandler();
//await click for randomize function.  Once clicked, run randomBtnHandler function
// userFormEl.addEventListener("submit", randomBtnHandler);