/*
 * Dani Bottiger & Alia Babinet
 * CS 257 SOFTWARE DESIGN - Fall 2021
 *
 * Video Games Comparisons Page Java Script
 */

window.onload = initialize;

function initialize() {

    homePage();
    recommendationsPage();
    rankingsPage();
    comparisonsPage();
    aboutPage();

    loadGame();

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

// COMPARISONS SPECIFIC
function loadGame(){
    //Load list of games that have the search term in them.
    //search orignally = ?game=<search_term>
    //so we need to do string formatting first.
    video_game = window.location.search.substring(6);
    video_game = video_game.replaceAll('+', ' ');

    video_game = video_game.split(" ");

    for (let i = 0; i < video_game.length; i++) {
        video_game[i] = video_game[i][0].toUpperCase() + video_game[i].substr(1);
    }

    video_game = video_game.join(" ");

    url = getBaseURL() + '/api/get_game/' + video_game;

    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(game_data){

            let body = '<h1>' + game_data[0]['name'] + '</h1>' +
            '<p>Year Released: ' + game_data[0]['year_of_release'] + '</p>' +
            '<p>Genre: ' + game_data[0]['genre'] + '</p>' +
            '<p>Publisher: ' + game_data[0]['publisher'] + '</p>' +
            '<p>Rating: ' + game_data[0]['rating'] + '</p>';

            //loading each game version or each platform the game is on
            for (var i = 1; i < Object.keys(game_data).length; i++){
                body+= '<h2>' + game_data[i]['platform'] + ' Version </h2>' +
                '<h3>Sales (in millions)</h3>' +
                '<p>North America Sales: ' + game_data[i]['na_sales'] + '</p>' +
                '<p>Europe Sales: ' + game_data[i]['eu_sales'] + '</p>' +
                '<p>Japan Sales: ' + game_data[i]['jp_sales'] + '</p>' +
                '<p>Other Sales: ' + game_data[i]['other_sales'] + '</p>' +
                '<p>Global Sales: ' + game_data[i]['global_sales'] + '</p>' +
                '<h3>Metacritic Scores</h3>' +
                '<p>Critic Score: ' + game_data[i]['critic_score'] + '</p>' +
                '<p>Critic Score Count: ' + game_data[i]['critic_count'] + '</p>' +
                '<p>User Score: ' + game_data[i]['user_score'] + '</p>' +
                '<p>User Score Count: ' + game_data[i]['user_count'] + '</p>' +
                '<br>';
            }

            let bodyText = document.getElementById('basic-paragraph1');
            if (bodyText){
                bodyText.innerHTML = body;
            }
    })
    .catch(function(error) {
        console.log(error);
    });
}
