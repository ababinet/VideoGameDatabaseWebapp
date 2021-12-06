/*
 * Dani Bottiger & Alia Babinet
 * CS 257 SOFTWARE DESIGN - Fall 2021
 *
 * Good Games Database
 * Search Page Java Script
 */

window.onload = initialize;

function initialize() {

    homePage();
    recommendationsPage();
    rankingsPage();
    comparisonsPage();
    aboutPage();
    loadResults();
}

function getBaseURL() {
    let baseURL = window.location.protocol
                    + '//' + window.location.hostname
                    + ':' + window.location.port;
    return baseURL;
}

// LINK FUNCTIONS
function homePage(){
    let url = getBaseURL() + '/';
    let link = document.getElementById('home_page');
    if (link){
        link.innerHTML = '<a href= "' + url + '">Home</a>';
    }
}

function recommendationsPage(){
    let url = getBaseURL() + '/recommendations/';
    let link = document.getElementById('recommendations_page');
    if (link){
        link.innerHTML = '<a href= "' + url + '">Recommendations</a>';
    }
}

function rankingsPage(){
    let url = getBaseURL() + '/rankings/';
    let link = document.getElementById('rankings_page');
    if (link){
        link.innerHTML = '<a href= "' + url + '">Rankings</a>';
    }
}

function comparisonsPage(){
    let url = getBaseURL() + '/comparisons/';
    let link = document.getElementById('comparisons_page');
    if (link){
        link.innerHTML = '<a href= "' + url + '">Comparisons</a>';
    }
}

function aboutPage(){
    let url = getBaseURL() + '/about/';
    let link = document.getElementById('about_page');
    if (link){
        link.innerHTML = '<a href= "' + url + '">About</a>';
    }
}

// SEARCH SPECIFIC
function loadHeading(search){
    let heading = document.getElementById('heading');
    if (heading){
        heading.innerHTML = 'Searching for "' + search + '":';
    }
}

function loadResults() {
    //Load list of games that have the search term in them.
    //search orignally = ?game=<search_term>
    //so we need to do string formatting first.
    search = window.location.search.substring(8);
    if (search != "" && search != null){
      search = search.replaceAll('+', ' ');

      search = search.split(" ");

      search = search.join(" ");
      loadHeading(search);

      let url = getBaseURL() + '/api/search/' + search;

      fetch(url, {method: 'get'})

      .then((response) => response.json())

      .then(function(videoGames) { //display the results
          let tableBody =`<tr>
                              <th>Game</th>
                              <th>Year Released</th>
                          </tr>`;

          for (let i = 0; i < videoGames.length; i++) {
            let videoGame = videoGames[i];
            formatted_name = videoGame['name'];
            formatted_name = formatted_name.replace(/\/.*/, '');

            tableBody += '<tr>'
                        + '<td> <a href="' + getBaseURL() + '/game/?game=' + formatted_name + '">'
                            + videoGame['name'] +  '</a></td>' //link to game info page
                        + '<td> ' + videoGame['year_of_release'] + '</td>'
                        + '</tr>\n';
          }
          if (videoGames.length == 0){
              tableBody = "No results found for " + search;
          }
          let table = document.getElementById('results_table');
          if (table) {
              table.innerHTML = tableBody;
          }
      })
      .catch(function(error) {
          console.log(error);
      });
    } else {
      loadHeading("");
    }
}
