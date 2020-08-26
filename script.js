      // Client ID and API key from the Developer Console
      var CLIENT_ID = '385891222717-v1tqhghg59ebc8e7sfs0q4jpno3ulbi7.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyC-8e2z0Vnfdm-QP2cGgqXFDkgRwyI00Do';

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

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function makeReagentList(reagent, quaility, room, shelf, amount, units) {
        var reagents = document.getElementById('reagents'); 
        var newOption = document.createElement("option");
        newOption.value = reagent;
        newOption.onclick = renderInfo(newOption.value);
        reagents.appendChild(newOption);
      }

      function renderInfo(reagent){
        console.log(reagent);
      }

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
