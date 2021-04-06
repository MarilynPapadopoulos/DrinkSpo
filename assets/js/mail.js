

// Get email addres from HTML




// create a mailto: with the email address

function generateEmailAddress(event) {
  var userEmail = document.getElementById("useremail").value;
  var generateEmailAddress = document.createElement("a");
console.log(userEmail);
  generateEmailAddress.setAttribute("href", "mailto:" + userEmail + "&subject=Cheers%20News&body=Body-goes-here");
  console.log(generateEmailAddress);
}
//get the drink that was diplayed

function generateEmail(){
    
}


document.getElementById("mailBtn").addEventListener("click",  generateEmailAddress);