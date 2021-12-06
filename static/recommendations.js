/*
 * Dani Bottiger & Alia Babinet
 * CS 257 SOFTWARE DESIGN - Fall 2021
 *
 * Good Games Database
 * Recommendations Page Java Script
 */

window.onload = initialize;

function initialize() {
    loadHeading("...");

    homePage();
    recommendationsPage();
    rankingsPage();
    comparisonsPage();
    aboutPage();

    let search_button_right = document.getElementById('search_button');
    if (search_button_right) {
        search_button_right.addEventListener("click", function(){ 
            loadRecommendations();
        });
    }

    let search_input_left = document.getElementById('search_bar');
    if(search_input_left){
      search_input_left.addEventListener("keyup", ({key}) => {
        if (key === "Enter"){
            loadRecommendations();
        }
      });
    }

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
    let url = getBaseURL() + '/comparisons/';;
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

// RECOMMENDATIONS SPECIFIC
function loadGame(search_term){
    let url = getBaseURL() + '/api/get_game/' + search_term;

    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(videoGame){
        played_game = videoGame[0]['name'];
        if (typeof played_game != 'undefined') {
            loadHeading(played_game);
        } else {
            //if the game doesn't actually exist, we don't want the top ten games of all genre that our API will return, so we redo the table text to reflect that.
            loadHeading(search_term);
            let tableBody = "No results found. This game does not exist in the database.";
            let table = document.getElementById('recommendations_table');
            if (table) {
                table.innerHTML = tableBody;
            }
        }
    })
    .catch(function(error) {
        console.log(error);
    });

}

function loadHeading(played_game){
    //Load heading with the search term included so its dynamic!
    let heading = document.getElementById('heading');
    if (heading){
        heading.innerHTML = 'Recommendations similar to "' + played_game + '":';
    }
}

function loadRecommendations() {
    played_game = document.getElementById('search_bar').value;

    let url = getBaseURL() + '/api/recommendations/' + played_game;

    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(videoGames) {
        let tableBody =`<tr>
                            <th>Rank</th>
                            <th>Game</th>
                            <th>Year Released</th>
                            <th>Genre</th>
                            <th>Meta Critic Score</th>
                            <th>Publisher</th>
                            <th>Rating</th>
                        </tr>`;

        for (let i = 0; i < videoGames.length; i++) {
            let videoGame = videoGames[i];
            formatted_name = videoGame['name'];
            formatted_name = formatted_name.replace(/\/.*/, '');
            tableBody += '<tr>'
                            + '<td>' + (i+1) + '</td>'
                            + '<td> <a href="' + getBaseURL() + '/game/?game=' + formatted_name + '">'
                                + videoGame['name'] +  '</a></td>' //link to game info page
                            + '<td> ' + videoGame['year_of_release'] + '</td>'
                            + '<td> ' + videoGame['genre'] + '</td>'
                            + '<td> ' + videoGame['critic_score'] + '</td>'
                            + '<td> ' + videoGame['publisher'] + '</td>'
                            + '<td> ' + videoGame['rating'] + '</td>'
                            + '</tr>\n';
        }

        let table = document.getElementById('recommendations_table');
        if (table) {
            table.innerHTML = tableBody;
        }

        loadGame(played_game);
    })
    .catch(function(error) {
        console.log(error);
    });
}
