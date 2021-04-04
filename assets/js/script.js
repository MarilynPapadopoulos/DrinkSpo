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
    $("#current-date").html("Date: " + today.toDateString());
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
    // send output object to post
    postFactoid( output )
};

// post factoid to DOM
function postFactoid( data ) {
    // create title
    var triviaDate = $( '<p>' )
        .attr( 'display', 'block' )
        .text( `On this date in ${data.year}`);

    // create trivia
    var triviaText = $( '<p>' )
        .attr( 'display', 'block' )
        .text( data.description );    

    // clear and append to DOM  
    $( '#trivia-title' )
        .html('')
        .append( triviaDate )
        .append( triviaText );
}

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
    // retun output object
    displayBeer( output )
};

function displayBeer( data ) {
    // set drink title
    var title = $( '#display-title' )
        .text( `Drink of the day: ${data.name} (${data.abv}%)`)
    // generate image and set alt
    var imageTag = $( '<img>' )
        .attr( 'src', data.image )   
        .attr( 'alt', data.name ) 
    // clear current image and post 
    $( '#display-image' )
        .html( '' )
        .append( imageTag )
    //generate directions
    var tagline = $( '<p>' )
        .attr( 'display', 'block' )
        .text( data.tagline )

    //food pairings
    var pairingTitle = $( '<p>' )
    .attr( 'display', 'block' )
    .text( 'Recommended Food Pairing' )

    // generate ul
    var list = $( '<ul>' )
    // generate li loop
    for ( var i = 0; i < data.foodpairing.length; i++ ) {
        // ingredient span
        var pair = $( '<span>' )
            .text( data.foodpairing[i])
        // li
        var li = $( '<li>' )
            .append( pair )
        // add li to list
        list.append( li )
    }

    // clear current text and post
    $( '#display-text' )
        .html( '' )
        .append( tagline )  
        .append( pairingTitle )
        .append( list ) 

}

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

function parseRandomDrink ( data ) {
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

    // send object to post
    displayCocktail( randomDrinkOutput );
};

function displayCocktail ( data ) {
    // set drink title
    var title = $( '#display-title' )
        .text( `Drink of the day: ${data.name}`)
    // generate image and set alt
    var imageTag = $( '<img>' )
        .attr( 'src', data.image )   
        .attr( 'alt', data.name ) 
    // clear current image and post 
    $( '#display-image' )
        .html( '' )
        .append( imageTag )
    //generate directions
    var directions = $( '<p>' )
        .attr( 'display', 'block' )
        .text( data.directions )

    // generate ul
    var list = $( '<ul>' )
    // generate li loop
    for ( var i = 0; i < data.recipe.length; i++ ) {
        // ingredient span
        var ingr = $( '<span>' )
            .text( `${data.recipe[i].ingredient}: ` )
        // measure span
        var meas = $( '<span>' )
            .text( data.recipe[i].measure )
        // li
        var li = $( '<li>' )
            .append( ingr )
            .append( meas )
        // add li to list
        list.append( li )
    }

    // clear current text and post
    $( '#display-text' )
        .html( '' )
        .append( directions )  
        .append( list )  
}

// error function
function error( ) {
    console.log( 'error' )
};

//Standard function to validate if an email was typed correctly
function ValidateEmail(mail) 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(myForm.emailAddr.value))
  {
    return (true)
  }
    // alert("You have entered an invalid email address!")
    $('#email-div').html("Error:  Please ensure email was entered correctly");
    return (false)
};

// get non alcaholic data, 57 total in the API
function getNonAlcList() {
    console.log("Entered Non Alc Function");
    //url already set by DB, set as variable
    var nonAlcDrinkUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic";
    //fetch it
    fetch(nonAlcDrinkUrl).then(function(response) {

        //if comes back ok
        if (response.ok) {
        response.json().then(function(data) {
            // put into object to pull from later
            nonAlcRandom ( data );
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

//Grabs an index number between 0-56 and outputs the corresponding drink id
function nonAlcRandom ( data ) {
    var idRandomize = Math.floor(Math.random () * 56)
    var getDrinkId = data.drinks[idRandomize].idDrink;
    //outputs to get all of the non alcaholic drink information to be fetches and parsed
    getNonAlcDrink (getDrinkId);
};

//Fetch the non alcaholic drink in the same fashion as the cocktails to be parsed and dispayed
function getNonAlcDrink( getDrinkId ) {
    //url already set by DB, set as variable
    var nonAlcDrinkIdUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + getDrinkId;
    //fetch it
    fetch(nonAlcDrinkIdUrl).then(function(response) {

        //if comes back ok
        if (response.ok) {
        response.json().then(function(data) {
            // put into object to pull from later
            parseRandomDrink ( data );
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

$( "#beer-btn" ).click(function() {
    getBeer();
});

$( "#cocktail-btn" ).click(function() {
    getCocktail();
});

$( "#non-alc-btn" ).click(function() {
    getNonAlcList();
});


// run historical factoid function
getNow();

// run randomizer for page load
function randomLoad() {
    //list of random functions
    var types = [
        getBeer,
        getCocktail,
        getNonAlcList,
    ]
    // randomized selection
    var random = Math.floor( Math.random() * types.length )
    // execute random function
    types[random]()
}
// on page load, run random function
randomLoad()


//await click for randomize function.  Once clicked, run randomBtnHandler function
// userFormEl.addEventListener("submit", randomBtnHandler);
