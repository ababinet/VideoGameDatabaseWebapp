/*
 * Dani Bottiger & Alia Babinet
 * CS 257 SOFTWARE DESIGN - Fall 2021
 *
 * Good Games Database
 * About Page Java Script
 */

window.onload = initialize;

function initialize() {

    homePage();
    recommendationsPage();
    rankingsPage();
    comparisonsPage();
    aboutPage();
    apiHelp();
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

function apiHelp(){
    let url = getBaseURL() + '/api/help';
    let link = document.getElementById('api_help');
    if (link){
        link.innerHTML = 'For those interested in the API, there is an <a href= "' + url + '">API help page</a> here';
      }
}
