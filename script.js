// Client ID and API key from the Developer Console
var CLIENT_ID = '273993762257-7eliess2v57h32c7pr7r5h8h2rc4vupo.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCxuFXNCH4tRdMlQs-njiHYNpYR1ZH8ymc ';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    makeReagentList(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    logReagents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

let reagentsCatalogue = [];
let reagentsList = [];

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function makeReagentList(reagent, quality, room, shelf, amount, units) {
  if(!reagentsList.includes(reagent)){
    var reagents = document.getElementById('reagents'); 
    var newOption = document.createElement("option");
    newOption.value = reagent;
    reagents.appendChild(newOption);
    reagentsList.push(reagent);
  }
  reagentsCatalogue.push([reagent, quality, room, shelf, amount, units]);
}

function renderInfo(){
  var reagent = document.getElementById("GET-reagent").value;
  var cards = document.getElementsByTagName('card');
  while(cards[0]){
    cards[0].parentNode.removeChild(cards[0])};
  reagentsCatalogue.forEach(item => {
    if(item[0]==reagent){
      console.log(reagent);
      var card = document.createElement("div");
      card.classList += "card";
      var room = document.createElement("h1");
      room.classList += "room";
      room.textContent = item[2];
      var shelf = document.createElement("div");
      shelf.classList += "shelf";
      var shelfName = document.createElement("h2");
      shelfName.classList += "shelf-name";
      shelfName.textContent = item[3];
      var shelfDesc = document.createElement("p");
      shelfDesc.classList += "shelf-description";
      var reagentData = document.createElement("div");
      reagentData.classList += "reagent-data";
      var quality =document.createElement("div");
      quality.classList += "quality";
      quality.textContent = item[1];
      var amount =document.createElement("div");
      amount.classList += "amount";
      amount.textContent = item[4] + ' ' + item[5];
      document.getElementsByTagName("body")[0].appendChild(card);
      card.appendChild(room);
      card.appendChild(shelf);
      card.appendChild(reagentData)
      shelf.appendChild(shelfName);
      shelf.appendChild(shelfDesc);
      reagentData.appendChild(quality);
      reagentData.appendChild(amount);
    }
  });
}

{/* <div class="card">
<h1 class="room">2218</h1>
<div class="shelf">
  <h2 class="shelf-name">23A</h2>
  <p class="shelf-description">Слева от стола Елены Геннадьевны</p>
</div>
<div class="reagent-data">
  <div class="quality">чда</div>
  <div class="amount">0.05 кг</div>
</div>
</div> */}



/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */

  function logReagents() {
  var spreadsheetId = '1r7b5ZisrlUiQ2VSNhWXh4931G_1JavMfJz1f6oBe5jU';
  var range = 'Основные (2216-2218/2220/2211)!B4:J1000';
  var values = gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId, 
    range: range}).then(function(response) {
    var range = response.result;
    var dataTable = [['reagent', 'quality', 'room', 'shelf', 'amount', 'unit']];
    if (range.values.length > 0) {
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        makeReagentList(row[0], row[4], row[5], row[6], row[7], row[8]);
        dataTable.push([row[0], row[4], row[5], row[6], row[7], row[8]]);
      }
    } else {
      makeReagentList('No data found.');
    }
  }, function(response) {
    makeReagentList('Error: ' + response.result.error.message);
  });
}
