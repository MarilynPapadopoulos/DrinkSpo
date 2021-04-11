// set initial search history
var searchHistory = []
// get storage of update history array
getStorage()
// display history list
displayHistory()

// set initial event array
var storedEvents = []
// get storage of events
getEvents()
// display events
// is at the end of each "display..." function so that the API content exists already to generate emails

// set initial settings object
var drink_userPref = {}

// on load, set modal class as modals and look for settings
$(document).ready(function () {
        // create modals
    $(".modal").modal();
         // get settings
    getSettings()
    // run historical factoid function on pageload
    getNow();
})



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
        // send date to get factoid AP  I call        
    getFactoid( date );
        // on page load, run random function
    randomLoad()
};

// randomize the factoid based on available settings
function randomFactLoad() {
        // get up to date settings
    getSettings()
        // init types
    var types = []
        // if setting is true, add the function to the randomizer
    if(drink_userPref.factsEvents){
        types.push('events.json')}
    if(drink_userPref.factsBirthdays){
        types.push('births.json')}
    if(drink_userPref.factsDeaths){
        types.push('deaths.json')}

        // if types has no entries (shouldnt happen) then all are added back in
    if(!types.length){
        types = [
                'events.json',
                'deaths.json',
                'births.json',
            ]
    }

    // randomized selection
    var random = Math.floor( Math.random() * types.length )
    // return random json for appending into link
    return types[random]
}

// get factoid API call
function getFactoid( date ) {  
    var lookup = randomFactLoad()
    // set api url
    var apiUrl = `https://byabbe.se/on-this-day/${date.month}/${date.day}/${lookup}`;
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
    var type
    var add
    if ( data.events ) {
        type = 'events'
        add = ''
    } else if ( data.births ) {
        type = 'births'
        add = ' was born.'
    } else if ( data.deaths ) {
        type = 'deaths'
        add = ' passed away.'
    }
    // choose random event
    var allEvents = data[`${type}`];
    // choose a random number between 0 and the length of the events list
    var random = Math.floor( Math.random() * allEvents.length );
    // set factoid object
    var factoid = data[`${type}`][ random ]
    // init output object
    var output = {}
    // set output properties
    output.description = factoid.description;
    output.year = factoid.year
    output.additional = add
    // send output object to post
    postFactoid( output )
};

// post factoid to DOM
function postFactoid( data ) {
    // create title
    var triviaDate = $( '<p>' )
        .attr( 'display', 'block' )
        .attr( 'id', 'trivia-date' )
        .text( `On this date in ${data.year}`);

    // create trivia
    var triviaText = $( '<p>' )
        .attr( 'display', 'block' )
        .attr( 'id', 'trivia-text' )
        .text( data.description + data.additional );    

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
    //handle missing image 
    missingImage();   

    //display events
    displayEvents()

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

    //display events
    displayEvents()
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
    var idRandomize = Math.floor(Math.random () * data.drinks.length)
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

// run randomizer for through the getNow() function
function randomLoad() {
        // get up to date settings
    getSettings()
        // init types
    var types = []
        // if setting is true, add the function to the randomizer
    if(drink_userPref.displayBeer){
        types.push(getBeer)}
    if(drink_userPref.displayCocktail){
        types.push(getCocktail)}
    if(drink_userPref.displayNonAlc){
        types.push(getNonAlcList)}
    
        // if types has no entries (shouldnt happen) then all are added back in
    if(!types.length){
        types = [
                getBeer,
                getCocktail,
                getNonAlcList,
            ]
    }

    // randomized selection
    var random = Math.floor( Math.random() * types.length )
    // execute random function
    types[random]()
}

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

// handle missing images from API
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
    var data = addr
    // if the incoming data is not an object, default some data
    if(!data.name){
        data = {
            name: 'there',
            email: addr,
            note: '',
        }
    }

    // get drink title
    var title = $( '#display-title')
        .text()
        .toLowerCase()

    // check to see if item has a tagline (therefore is a beer)    
    var desc = $( '#display-text' )
        .find( '#tagline' )
    // init body
    var body = []   
    
    // Greeting
    body.push( `Hey ${data.name}!` )
    // if there a personal note, add here
    if(data.note.length > 0) {
        body.push( '%0D%0A' )
        body.push( '%0D%0A' )   
        body.push( data.note )
    }
    body.push( '%0D%0A' )
    body.push( '%0D%0A' )
    body.push( 'I found this drink which I thought you might enjoy. ' )
    

    // if is beer    
    if( desc[0] ) { // generate this email content

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


    } else { // otherwise is cocktail, // generate this email content
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
    } 

    var triviaDate = $( '#trivia-date' )
        .text()
        .replace( 'On ', '');
    var triviaText = $( '#trivia-text' )
        .text();
    
    body.push( '%0D%0A' )    
    body.push( `Finally, here is a random factoid from ${triviaDate} to add to your trivia knowledge!` )
    body.push( '%0D%0A' ) 
    body.push( `- ${triviaText}` ) 
    body.push( '%0D%0A' )  
    body.push( '%0D%0A' )   
    body.push( 'Enjoy!' )
    body.push( '%0D%0A' ) 
    
    body = body.join(' ')    

        // console.log( desc)



    // email to:
    var email = data.email;
    var subject = `Check out this ${title}!`;
    var emailBody = body;
    window.location = 'mailto:' + email + '?subject=' + subject + '&body=' +   emailBody;
}

// click on settings button
$('#settings').click(function(){
        // get settings
    getSettings()
        // map settings to DOM
        // map drink settings
    if (drink_userPref.displayCocktail){
        $( '#settings-cocktail' )
            .prop('checked',true)
    } 
    if (drink_userPref.displayBeer){
        $( '#settings-beer' )
            .prop('checked',true)
    }
    if (drink_userPref.displayNonAlc){
        $( '#settings-non' )
            .prop('checked',true)
    }
    
        // overrides for under/over age defaults
    if(!drink_userPref.underage){
        $( '#settings-underage' )
            .prop('checked',false)
        $( '#set-cocktail' )
            .hide()
        $( '#settings-cocktail' )
            .prop('checked',false)
        $( '#set-beer' )
            .hide()
        $( '#settings-beer' )
            .prop('checked',false)
        $( '#settings-non' )
            .prop('checked',true)
            .prop('disabled',true)
    } else if (drink_userPref.underage){
        $( '#settings-underage' )
            .prop('checked',true)
        $( '#set-cocktail' )
            .show()
        $( '#set-beer' )
            .show()
        $( '#settings-beer' )
        $( '#settings-non' )
            .prop('disabled',false)
    }

    if (drink_userPref.factsEvents){
        $( '#settings-facts' )
            .prop('checked',true)
    }
    if (drink_userPref.factsBirthdays){
        $( '#settings-births' )
            .prop('checked',true)
    }
    if (drink_userPref.factsDeaths){
        $( '#settings-deaths' )
            .prop('checked',true)
    }
        // open modal
    $('#settings-modal').modal('open');

});

// show/hide DOM elements based on settings
function displayButtons(data){
        // beer button
    if(data.displayBeer){
        $( '#beer-btn' )
            .show()
    } else {
        $( '#beer-btn' )
            .hide()
    }
        // cocktail button
    if(data.displayCocktail){
        $( '#cocktail-btn' )
            .show()
        $( '#search-ing-container' )
            .show()    
    } else {
        $( '#cocktail-btn' )
            .hide()
        $( '#search-ing-container' )
            .hide() 
    }
        // non-alc button
    if(data.displayNonAlc){
        $( '#non-alc-btn' )
            .show()
    } else {
        $( '#non-alc-btn' )
            .hide()
    }

}

// check for initial user settings
function getSettings() {
     // set initial array
     drink_userPref = {}
     // if storage key exists, set variable as parse data
     if( JSON.parse( localStorage.getItem( 'drinkspo-settings') ) ) {
        drink_userPref = JSON.parse( localStorage.getItem( 'drinkspo-settings') )
     } else {
            // open settings modal
        $('#settings-modal').modal('open');
            // stop email trigger from opening
        emailModal = 1
            // initial settings
        $( '#set-cocktail' )
            .hide()
        $( '#settings-cocktail' )
            .prop('checked',false)
        $( '#set-beer' )
            .hide()
        $( '#settings-beer' )
            .prop('checked',false)
        $( '#settings-non' )
            .prop('checked',true)
            .prop('disabled',true)
        $( '#settings-facts' )
            .prop('checked',true)
        $( '#settings-births' )
            .prop('checked',false)
        $( '#settings-deaths' )
            .prop('checked',false)
     }
        // update displayed button
     displayButtons(drink_userPref)
     return drink_userPref
}

// listen for checkbox change
$('input[type=checkbox]').change( function(){
        var id = $(this)
            .attr('id')
        var status = $(this.checked)[0]
        if(!status){ status = false }

        if( id === 'settings-underage' && status === true) {
            console.log('check')
            $( '#set-cocktail' )
                .show()
            $( '#set-beer' )
                .show()
            $( '#settings-non' )
                .prop('disabled',false)
        } else if ( id === 'settings-underage' && status === false) {
            $( '#set-cocktail' )
                .hide()
            $( '#settings-cocktail' )
                .prop('checked',false)
            $( '#set-beer' )
                .hide()
            $( '#settings-beer' )
                .prop('checked',false)
            $( '#settings-non' )
                .prop('checked',true)
                .prop('disabled',true)
        } else {
            return
        }
});

// listen for form submit
$('#settings-form').submit(function(event){
    event.preventDefault()
    var data = $(this).serializeArray()
    storeSettings(data)
    $('#settings-modal').modal('close');
    $('#settings-form').trigger('reset');
})

// store settings
function storeSettings( data ) {
        // define settings variable, and set to true/false 
    var underage=           data.find(x => x.name === 'settings-underage')
    underage == undefined ? underage = false : underage = true
    var displayCocktail=    data.find(x => x.name === 'settings-cocktail')   
    displayCocktail == undefined ? displayCocktail = false : displayCocktail = true
    var displayBeer=        data.find(x => x.name === 'settings-beer') 
    displayBeer == undefined ? displayBeer = false : displayBeer = true  
    var displayNonAlc=      data.find(x => x.name === 'settings-non')     
    displayNonAlc == undefined ? displayNonAlc = false : displayNonAlc = true  
    if(!underage){displayNonAlc = true }
    var factsEvents=        data.find(x => x.name === 'settings-facts')  
    factsEvents == undefined ? factsEvents = false : factsEvents = true 
    var factsBirthdays=     data.find(x => x.name === 'settings-births')    
    factsBirthdays == undefined ? factsBirthdays = false : factsBirthdays = true  
    var factsDeaths=        data.find(x => x.name === 'settings-deaths') 
    factsDeaths == undefined ? factsDeaths = false : factsDeaths = true 

        // build settings obj
    drink_userPref = { 
        underage:           underage,  
        displayCocktail:    displayCocktail,    
        displayBeer:        displayBeer,   
        displayNonAlc:      displayNonAlc,     
        factsEvents:        factsEvents,  
        factsBirthdays:     factsBirthdays,    
        factsDeaths:        factsDeaths,    
    }

        // stringify
    var string = JSON.stringify( drink_userPref )
        // set to localStorage
    localStorage.setItem( 'drinkspo-settings', string )
        // update DOM based on settings
    displayButtons(drink_userPref)
}

// click on new calendar event button
$('#calendar').click(function(){
    //open modal
    $('#calendar-modal')
        .modal('open')
    // generate date picker
    $( "#contact-date" ).datepicker({
        showButtonPanel: true
      });
})

// listen for form submit
$('#event-form').submit(function(event){
    event.preventDefault()
    var data = $(this).serializeArray()
    storeEvent(data)
})

// set event storage
function storeEvent(data) {
        // collect data from serialized array
    var name = data.find(x => x.name === 'contact-name');
    var email = data.find(x => x.name === 'contact-email');
    var note = data.find(x => x.name === 'contact-content');
    var date = data.find(x => x.name === 'contact-date');
        // change date string to actual datevalue
    date.value = Date.parse(date.value)
        // if recurring date is not checked, set as false
    var recurring = data.find(x => x.name === 'event-recurring');
    recurring == undefined ? recurring = {value:false} : recurring = {value:true}
        // create storage item
    var storageItem = {
        name: name.value,
        email: email.value,
        note: note.value,
        date: date.value,
        recurring: recurring.value,
        send: false,
    }
        // add to array
    storedEvents.push(storageItem)
        // loop in storage id
    for( var i = 0; i < storedEvents.length; i++) {
        storedEvents[i].i = i
    }    

        // stringify
    var string = JSON.stringify( storedEvents )
        // set to localStorage
    localStorage.setItem( 'drinkspo-events', string )
        // reset form
    $('#event-form').trigger('reset')
        // close modal
    $('#calendar-modal')
        .modal('close')
        // reset display
    $('#event-list')
        .html( '' )
        // mark email modal as already having been opened so it doesnt load right away if event is past already
    emailModal = 1
        // run display function
    displayEvents()
}

// get events from storage
function getEvents(){
        // set initial array
        storedEvents = []
        // if storage key exists, set variable as parse data
    if( JSON.parse( localStorage.getItem( 'drinkspo-events') ) ) {
        storedEvents = JSON.parse( localStorage.getItem( 'drinkspo-events') )
    }
        // run to-be-created time difference function which will look at now vs the stored date and give a difference (positive or negative)
}

// display events in settings list
function displayEvents(){
    //get updated event status on load
    getEvents()

   // if there are stored events, display
    if(storedEvents.length){
            // run updated date comparison
        dateCompare(storedEvents)
            // sort event
        var sortEvents = storedEvents.sort(({diff:a}, {diff:b}) => a-b);

        for (var i = 0; i < sortEvents.length; i++){
            var date = new Date(sortEvents[i].date)
            date = date.toLocaleDateString()

                // event content
                var eventName = $( '<span>' )
                .text(sortEvents[i].name)
            var eventEmail = $( '<span>' )
                .text(` ( ${sortEvents[i].email} ) `)
            var eventDate = $( '<span>' )
                .text(`${date} - `)
            var container = $( '<div>' )
                .append( eventDate )
                .append( eventName )
                .append( eventEmail )

            var recurring = sortEvents[i].recurring
                if(recurring) {
                    var eventRecurring = $( '<span>' )
                        .html(`<i class="fas fa-sync-alt"></i><i class="fas fa-calendar-alt"></i>`)
                    container.append( eventRecurring )
                } else {
                    var eventRecurring = $( '<span>' )
                        .html(`<i class="fas fa-calendar-day"></i>`)
                    container.append( eventRecurring )
                }   

            var sent = sortEvents[i].send
                if(sent) {
                    var eventSent = $( '<span>' )
                        .html(`<i class="fas fa-check"></i>`)
                    container.append( eventSent )
                }    

                // delete button
            var del = $( '<span>' )
                .addClass( 'event-del' )
                .html('&times;')
            var delDiv = $( '<div>' )
                .addClass( 'delete' )
                .attr( 'idx', i )
                .append( del )

            var line = $( '<li>' )
                .addClass( 'event-item' )
                .append(container)
                .append( delDiv )

            $('#event-list')
                .append( line )      
        }
    }
}

// delete event items
$( '#settings-modal' ).click( '.event-del', function(event){
        // get id of line to target within storage array
    var target = $(event.target)
            .closest( '.delete' )
            .attr( 'idx' )
     
    if(target){
            // splice out id
        storedEvents.splice(target,1);

            // stringify
        var string = JSON.stringify( storedEvents )
            // set to localStorage
        localStorage.setItem( 'drinkspo-events', string )

            // reset display
        $('#event-list')
            .html( '' )
            
            // run display function
        displayEvents()
    }

})

// compare dates to current (for local use only, does not need to be stored)
function dateCompare(data){
        // get current date
    var now = Date.now()
        // compare each time and add/update diff object property
    for(var i = 0; i < data.length; i++) {
            // negative number of days are in the past
        data[i].diff = (data[i].date-now)/86400000
    }
    recurringEvent(data)

        // check for unsent emails
    triggeredEmail(data)  
}

// review recurring events
function recurringEvent(data){
    for( var i = 0; i < data.length; i++){
        if(data[i].diff < -350 && data[i].recurring == true) {
            data[i].date = data[i].date + 31536000000
            data[i].send = false
        }
    }
    // stringify
    var string = JSON.stringify( data )
        // set to localStorage
    localStorage.setItem( 'drinkspo-events', string )

    // return data
}

// generate email based on date past
function triggeredEmail(data){
        // filter for events with <=0 "diff" times
    sendEvent = data.filter(x => x.diff <= 0 && x.send == false);

        // init email loop
    askToEmail(sendEvent)
}
// set counter on email modal open so it only opens once on page load
var emailModal = 0
// ask user if they want to send an email
function askToEmail(data) {
    if(data.length && emailModal === 0){
            // create text string
        var text = $( '<h6>' )
            .text( `You have an un-sent email events from your calendar. Click and entry to send email`)
            // create unordered list
        var ul = $( '<ul>' )
            // create list items
        var sortEvents = data.sort(({diff:a}, {diff:b}) => a-b);

        for (var i = 0; i < sortEvents.length; i++){
            var date = new Date(sortEvents[i].date)
            date = date.toLocaleDateString()

                // event content
            var eventName = $( '<span>' )
                .text(sortEvents[i].name)
            var eventEmail = $( '<span>' )
                .text(` ( ${sortEvents[i].email} ) `)
            var eventDate = $( '<span>' )
                .text(`${date} - `)
            var container = $( '<div>' )
                .append( eventDate )
                .append( eventName )
                .append( eventEmail )

            var recurring = sortEvents[i].recurring
            if(recurring) {
                var eventRecurring = $( '<span>' )
                    .html(`<i class="fas fa-sync-alt"></i><i class="fas fa-calendar-alt"></i>`)
                container.append( eventRecurring )
            } else {
                var eventRecurring = $( '<span>' )
                    .html(`<i class="fas fa-calendar-day"></i>`)
                container.append( eventRecurring )
            }     

            var line = $( '<li>' )
                .addClass( 'event-item' )
                .attr( 'id', i )
                .attr( 'store-id', sortEvents[i].i)
                .append(container)

            ul.append( line )      
        }

            // clear and append text content    
        $( '#email-content' )
            .html( '' )
            .append( text )
            .append( ul )
            // open email modal
        $('#email-modal')
            .modal('open')
            // mark email modal as already having been opened
        emailModal = 1   
            // init response variable
        $('#email-modal').click('li', function(event){
            var target = $(event.target)
            var storageIndex = target[0].attributes['store-id'].textContent
                // find index in displayed list of entity
            var index = storedEvents.findIndex( x => 
                x.i == storageIndex
            );
                // set "sent" as true
            storedEvents[index].send = true
                // stringify
            var string = JSON.stringify( storedEvents )
                // set to localStorage
            localStorage.setItem( 'drinkspo-events', string )
                // send line to generate email
            emailGen( sortEvents[target[0].id] )
                // add tag to list item to show it was sent
            var sendTag = $( '<span>' )
                .html(`<i class="fas fa-check"></i>`)
                .addClass( 'email-sent' );
            target.append(sendTag)
        })
    }
}

$('#ing-search-btn').on('click', function(event){
    event.preventDefault();
    console.log("Entered By Ingredient Function");
    var ingSearch = $('#ing-search').val();
    console.log(ingSearch);
    //url already set by DB, set as variable
    var nonIngUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingSearch;
    //fetch it
    fetch(nonIngUrl).then(function(response) {

        //if comes back ok
        console.log(response);
        // if (response.ok) {
            console.log("before response.json")
        response.json().then(function(data) {
            console.log(data);
            // put into object to pull from later
            nonAlcRandom ( data );
        }).catch(function (error) {
            $("#display-text").html("Oh no!  Your search wasn't able to display a result. Please try again");
            error()
        })
        
    })

    // catch
    .catch( function (error) {
        error()
        $("#display-text").html("Oh no!  Your search wasn't able to display a result. Please try again");
    })

});