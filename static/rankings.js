/*
 * Dani Bottiger & Alia Babinet
 * CS 257 SOFTWARE DESIGN - Fall 2021
 *
 * Video Games
 * Rankings Page Java Script
 */

window.onload = initialize;

function initialize() {
    loadYears();
    loadLimitDisplays();
    loadRankings();
    loadHeading(5, "All Time");

    homePage();
    recommendationsPage();
    rankingsPage();
    comparisonsPage();
    aboutPage();

    let year_element = document.getElementById('year_selector');
    if (year_element) {
        year_element.onchange = loadRankings;
    }

    let display_element = document.getElementById('display_selector');
    if (display_element) {
        display_element.onchange = loadRankings;
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

// RANKING SPECIFIC

function loadHeading(limit, year){
    //dynamic heading that takes in the user's choices
    let heading = document.getElementById('heading');
    if (heading){
        heading.innerHTML = 'Top ' + limit + ' from ' + year + ':';
    }
}

function loadYears() {
    //by getting the years from the api, it'll update if any game from a new year is added
    let url = getBaseURL() + '/api/years/';

    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(years) {
        // Add the <option> elements to the <select> element
        let selectorBody = '<option value="' + 'All Time' + '"> '
                            + 'All Time'
                            + ' </option>\n';
        for (let i = 0; i < years.length; i++) {
            let year = years[i];
            selectorBody += '<option value="' + year + '"> '
                                + year
                                + ' </option>\n';
        }

        let selector = document.getElementById('year_selector');
        if (selector) {
            selector.innerHTML = selectorBody;
        }
    })

    // Log the error if anything went wrong during the fetch.
    .catch(function(error) {
        console.log(error);
    });
}

function loadLimitDisplays() {
    //we'll load our display choices here via javascript
    let displays = [5, 10, 20, 50];
    let selectorBody = '';
        for (let i = 0; i < displays.length; i++) {
            let display = displays[i];
            selectorBody += '<option value="' + display + '"> '
                                + display
                                + ' </option>\n';
        }

        let selector = document.getElementById('display_selector');
        if (selector) {
            selector.innerHTML = selectorBody;
        }
}

function loadRankings() {
    let limit = document.getElementById('display_selector').value;
    let year = document.getElementById('year_selector').value;

    loadHeading(limit, year);

    //url formatting to include limit and year selections
    let url = getBaseURL() + '/api/rankings/' + limit;
    if (year != null){
        url += "?year=" + year;
    }

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
            tableBody += '<tr>'
                            + '<td>' + (i+1) + '</td>'
                            + '<td> <a href="' + getBaseURL() + '/game/?game=' + videoGame['name'] + '">'
                                + videoGame['name'] +  '</a></td>' //link to game info page
                            + '<td> ' + videoGame['year_of_release'] + '</td>'
                            + '<td> ' + videoGame['genre'] + '</td>'
                            + '<td> ' + videoGame['critic_score'] + '</td>'
                            + '<td> ' + videoGame['publisher'] + '</td>'
                            + '</tr>\n';
        }
        let table = document.getElementById('rankings_table');
        if (table) {
            table.innerHTML = tableBody;
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}
