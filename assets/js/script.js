// set initial search history
var searchHistory = []
// get storage of update history array
getStorage()
// display history list
displayHistory()

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
    output.image_url = data[0].image_url;
    output.food_pairing = data[0].food_pairing
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
        .attr( 'src', data.image_url )   
        .attr( 'alt', data.name ) 
    // clear current image and post 
    $( '#display-image' )
        .html( '' )
        .append( imageTag )
    //generate directions
    var tagline = $( '<p>' )
        .attr( 'display', 'block' )
        .attr( 'id', 'tagline' )
        .text( data.tagline )

    //food pairings
    var pairingTitle = $( '<p>' )
    .attr( 'display', 'block' )
    .attr( 'id', 'pairing' )
    .text( 'Recommended Food Pairing' )

    // generate ul
    var list = $( '<ul>' )
    // generate li loop
    for ( var i = 0; i < data.food_pairing.length; i++ ) {
        // ingredient span
        var pair = $( '<span>' )
            .text( data.food_pairing[i])
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

    // set item to storage
    setStorage( data, 'parseBeer' ) 
    missingImage();   

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
    var randomDrinkOutput = {}
    if( !data.drinks ) {
        randomDrinkOutput.name = data[0].name;
        randomDrinkOutput.image = data[0].image;
        randomDrinkOutput.directions = data[0].directions;
        randomDrinkOutput.recipe = data[0].recipe;
    } else {
    //create object to match parse functions above
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
    }
  
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
        .attr( 'id', 'directions' )
        .text( data.directions )

    // generate ul
    var list = $( '<ul>' )
    // generate li loop
    for ( var i = 0; i < data.recipe.length; i++ ) {
        // ingredient span
        var ingr = $( '<span>' )
            .attr( 'id', 'ingr' )
            .text( `${data.recipe[i].ingredient}: ` )
        // measure span
        var meas = $( '<span>' )
            .attr( 'id', 'meas' )
            .text( data.recipe[i].measure )
        // li
        var li = $( '<li>' )
            .attr( 'id', 'recipe' )
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

    // set item to storage
    setStorage( data, 'parseRandomDrink' )    
}

// error function
function error( ) {
    console.log( 'error' )
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

// set storage entry
function setStorage( data, query ) {
    var storageItem = { 
        function: query,
        data: data,
        timestamp: Date.now()
     }
        // search history to see if current item exists. If yes, splice out. This will move current entry to the top of the display list
    $.each(searchHistory, function(i){
        if(searchHistory[i].data.name === storageItem.data.name) {
            searchHistory.splice(i,1);
            return false;
        }
    });
        // push to storage item
    searchHistory.push( storageItem) 
        // stringify
    var string = JSON.stringify( searchHistory )
        // set to localStorage
    localStorage.setItem( 'drinklet-history', string )
        // clear current display
    $( '#history-list' )
        .html( '' )
     // post display
    displayHistory()
};


// get storage entries
function getStorage() {
    // set initial array
    searchHistory = []
    // if storage key exists, set variable as parse data
    if( JSON.parse( localStorage.getItem( 'drinklet-history') ) ) {
        searchHistory = JSON.parse( localStorage.getItem( 'drinklet-history') )
    }
};

// display history list
function displayHistory() {
    // sort history list descending (newest first)
var sortedDesc = searchHistory.sort(({timestamp:a}, {timestamp:b}) => b-a);
    // set max value of list (13 items)
var listValue = Math.min( sortedDesc.length, 13 )
for ( var i = 0; i < listValue; i++) {
    var span = $( '<span>' )
        .text( sortedDesc[i].data.name )
        .attr( 'dataset', JSON.stringify( sortedDesc[i] ) )
    var li = $( '<li>' )
        .append( span )
    $( '#history-list' )
        .append( li )    
    }
};

// click on item from history
$( '#history-list').on( 'click', 'li' , function() {
    // get this
    var info = $( this )
        .find( 'span' )
        .attr( 'dataset' )
    var parse = JSON.parse( info )    
    // get function
    var functionToRun = parse.function
    // get data
    var dataObject = [parse.data]

    // run function with stored data to post item
    eval(functionToRun)( dataObject )
})

function missingImage () {
   var ifImage = $( '#display-image' ).find( 'img' ).attr( 'src' )
 
   if (!ifImage) {
    $( '#display-image' ).find( 'img' ).attr( 'src', "./assets/images/beerplaceholder.jpeg")
   }
}

// listen for submit of email
$( "#target" ).submit(function( event ) {
    event.preventDefault();
    var emailField = $( '#email' )
        .val()
        .trim();
    // send email to generation function
    emailGen( emailField )
    // clear email after clicking
    $( '#email' )
        .val( '' )

});

// email generation
function emailGen( addr ) {
    // get drink title
    var title = $( '#display-title')
        .text()
        .toLowerCase()

    // check to see if item has a tagline (therefore is a beer)    
    var desc = $( '#display-text' )
        .find( '#tagline' )
    // init body
    var body = []    
    // if is beer    
    if( desc[0] ) { // generate this email content
        // Greeting
        body.push( 'Hey there!' )
        body.push( '%0D%0A' )
        body.push( '%0D%0A' )
        body.push( 'I found this drink which I thought you might enjoy. ' )

        // get just the beer name
        var titleBody = title
                        .replace( 'drink of the day: ', '' )
        // capitalize the first letter
        titleBody = titleBody[0].toUpperCase() + titleBody.substring(1)                

        var tagline = desc
                        .text()
                        .toLowerCase()
        body.push( `${titleBody} is a`)                
        body.push( tagline )
        body.push( '%0D%0A' )
        body.push( '%0D%0A' )

        body.push( 'Here are a few foods that I would recommend for pairing:' )
        body.push( '%0D%0A' )
        var pairings = $( '#display-text')
            .find( 'li' )
            .each( function( i ) {
                body.push( '-' )
                body.push( $(this)
                                .find( 'span' )
                                .text()
                                )
                body.push( '%0D%0A' )
            })

        body.push( '%0D%0A' )    
        body.push( 'Enjoy!' )
        body.push( '%0D%0A' ) 
        
        body = body.join(' ')    

    } else { // otherwise is cocktail, // generate this email content
        // Greeting
        body.push( 'Hey there!' )
        body.push( '%0D%0A' )
        body.push( '%0D%0A' )
        body.push( 'I found this drink which I thought you might enjoy, the' )

        // get just the cocktail name
        var titleBody = title
                        .replace( 'drink of the day: ', '' )
        // capitalize the first letter
        titleBody = titleBody[0].toUpperCase() + titleBody.substring(1)      
        
        desc = $( '#display-text' )
            .find( '#directions' )
            .text()
        
        body.push( `${titleBody}!`)                
        body.push( '%0D%0A' )
        body.push( '%0D%0A' )
        body.push( `To make the ${titleBody}: ` )
        body.push( desc )
        body.push( '%0D%0A' )
        body.push( '%0D%0A' )

        body.push( 'Here is the recipe:' )
        body.push( '%0D%0A' )
        var recipe = $( '#display-text')
            .find( 'li' )
            .each( function( i ) {
                body.push( '-' )
                body.push( $(this)
                                .find( '#ingr' )
                                .text()
                                )
                body.push( $(this)
                                .find( '#meas' )
                                .text()
                                )
                body.push( '%0D%0A' )
            })

        body.push( '%0D%0A' )    
        body.push( 'Enjoy!' )
        body.push( '%0D%0A' ) 
        
        body = body.join(' ')  
    }    

        // console.log( desc)



    // email to:
    var email = addr;
    var subject = `Check out this ${title}!`;
    var emailBody = body;
    window.location = 'mailto:' + email + '?subject=' + subject + '&body=' +   emailBody;
}

//$('#of-age').on('click', function(e) {
//    e.preventDefault;
    $(document).ready(function () {
        $(".modal").modal();
        $('#modal1').modal('open');
 

    //getStorage(underage);
   
    var drink_userPref = { 
        underage: false,  
        displayCocktail: true,   
        displayBeer: true,   
        factsBirthdays: false,   
        factsDeaths: false,   
        factsEvents: true 
    }
  
    $('#btn-no').click(function() {
        drink_userPref.underage = true;
        console.log("clicked no/true", drink_userPref.underage);
        getNonAlcList();

        localStorage.setItem('underage', drink_userPref.underage);
    });
    

    //var drink_userPrefToString =JSON.stringify(drink_userPref);
    //localStorage.setItem("underage", drink_userPrefToString);

 
    
    });
    
//})