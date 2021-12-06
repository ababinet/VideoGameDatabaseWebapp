/*
 * Dani Bottiger & Alia Babinet
 * CS 257 SOFTWARE DESIGN - Fall 2021
 *
 * Video Games Java Script
 */

window.onload = initialize;

function initialize() {
    loadBestVideoGames();

    homePage();
    recommendationsPage();
    rankingsPage();
    comparisonsPage();
    aboutPage();
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

// INDEX/HOME PAGE SPECIFIC
function loadBestVideoGames() {
    let url = getBaseURL() + '/api/bestgames/';

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
                        </tr>`;

        for (let i = 0; i < videoGames.length; i++) {
            let videoGame = videoGames[i];
            formatted_name = videoGame['name'];
            formatted_name = formatted_name.replace(/\/.*/, '');
            tableBody += '<tr>'
                            + '<td>' + (i+1) + '</td>'
                            + '<td> <a href="' + getBaseURL() + '/game/?game=' + formatted_name + '">'
                                + videoGame['name'] +  '</a></td>' //link to game info pages
                            + '<td> ' + videoGame['year_of_release'] + '</td>'
                            + '<td> ' + videoGame['genre'] + '</td>'
                            + '<td> ' + videoGame['critic_score'] + '</td>'
                            + '<td> ' + videoGame['publisher'] + '</td>'
                            + '</tr>\n';
        }
        let table = document.getElementById('best_video_games_table');
        if (table) {
            table.innerHTML = tableBody;
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}
