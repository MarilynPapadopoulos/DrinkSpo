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
        .attr( 'id', 'trivia-date' )
        .text( `On this date in ${data.year}`);

    // create trivia
    var triviaText = $( '<p>' )
        .attr( 'display', 'block' )
        .attr( 'id', 'trivia-text' )
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

// on load, set modal class as modals
$(document).ready(function () {
    $(".modal").modal();
})

// click on settings button
$('#settings').click(function(){
    $('#settings-modal').modal('open');

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

   // if there are stored events, display
    if(storedEvents.length){
            // run updated date comparison
        dateCompare(storedEvents)


            // TBD once I have a time difference function
        var sortEvents = storedEvents.sort(({diff:a}, {diff:b}) => a-b);

        for (var i = 0; i < sortEvents.length; i++){
            var date = new Date(sortEvents[i].date)
            date = date.toLocaleDateString()

                // event content
            var eventName = $( '<span>' )
                .text(sortEvents[i].name)
            var eventEmail = $( '<span>' )
                .text(sortEvents[i].email)
            var eventNote = $( '<span>' )
                .text(sortEvents[i].note)
            var eventDate = $( '<span>' )
                .text(date)
            var eventRecurring = $( '<span>' )
                .text(`recurring: ${sortEvents[i].recurring}`)
            var eventSent = $( '<span>' )
                .text(`sent: ${sortEvents[i].send}`)
            var container = $( '<div>' )
                .append( eventName )
                .append( eventEmail )
                .append( eventNote )
                .append( eventDate )
                .append( eventRecurring )
                .append( eventSent )

                // delete button
            var del = $( '<span>' )
                .addClass( 'event-del' )
                .html('&times;')
            var delDiv = $( '<div>' )
                .addClass( '.delete' )
                .attr( 'id', i )
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
            .closest( 'div' )
            .attr( 'id' )
    
    console.log( target )

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
        // check for unsent emails
    triggeredEmail(data)  
}

// generate email based on date past
function triggeredEmail(data){
        // filter for events with <=0 "diff" times
    sendEvent = data.filter(x => x.diff <= 0 && x.send == false);

        // init email loop
    askToEmail(sendEvent)
}

// ask user if they want to send an email
function askToEmail(data) {
    if(data.length){
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
                .text(sortEvents[i].email)
            var eventNote = $( '<span>' )
                .text(sortEvents[i].note)
            var eventDate = $( '<span>' )
                .text(date)
            var eventRecurring = $( '<span>' )
                .text(`recurring: ${sortEvents[i].recurring}`)
            var container = $( '<div>' )
                .append( eventName )
                .append( eventEmail )
                .append( eventNote )
                .append( eventDate )
                .append( eventRecurring )

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
                .text( ' -sent' )
                .addClass( 'email-sent' );
            target.append(sendTag)
        })
    }
}