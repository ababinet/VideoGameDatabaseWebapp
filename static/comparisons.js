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

    let search_button_left = document.getElementById('search_button_left');
    if (search_button_left) {
        search_button_left.addEventListener("click", function(){ 
            loadBasicComparisons(1);
            loadPlatformComparisons(1);
        });
    }

    let search_button_right = document.getElementById('search_button_right');
    if (search_button_right) {
        search_button_right.addEventListener("click", function(){ 
            loadBasicComparisons(2);
            loadPlatformComparisons(2);
        });
    }

    let search_input_left = document.getElementById('game_left');
    if(search_input_left){
      search_input_left.addEventListener("keyup", ({key}) => {
        if (key === "Enter"){
            loadBasicComparisons(1);
            loadPlatformComparisons(1);
        }
      });
    }

    let search_input_right = document.getElementById('game_right');
    if(search_input_right){
      search_input_right.addEventListener("keyup", ({key}) => {
        if (key === "Enter") {
            loadBasicComparisons(2);
            loadPlatformComparisons(2);
        }

      });
    }

    let selected_platform_left = document.getElementById('platform-selector1')
    if (selected_platform_left){
        selected_platform_left.addEventListener("change", function(){ 
            loadPlatformComparisons(1); 
        });
    }

    let selected_platform_right = document.getElementById('platform-selector2')
    if (selected_platform_right){
        selected_platform_right.addEventListener("change", function(){ 
            loadPlatformComparisons(2); 
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

// COMPARISONS SPECIFIC
function loadHeading(video_game_1, video_game_2){
    if (video_game_1 != null && video_game_1 != ""){
        url = getBaseURL() + '/api/get_game/' + video_game_1;
        fetch(url, {method: 'get'})

        .then((response) => response.json())

        .then(function(game_data){
            if (Object.keys(game_data).length >= 2){
                video_game_1 = game_data[0]['name'];
            }

            let heading = document.getElementById('heading');

            if (video_game_2 == null || video_game_2 == ""){
                video_game_2 = '...';
            }
            if (heading){
                heading.innerHTML = 'Comparing "' + video_game_1 + '" to "' + video_game_2 +  '":';
            }

        })
        .catch(function(error) {
            console.log(error);
        });
    }
    if (video_game_2 != null && video_game_2 != ""){
        url = getBaseURL() + '/api/get_game/' + video_game_2;
        fetch(url, {method: 'get'})

        .then((response) => response.json())

        .then(function(game_data){
            if (Object.keys(game_data).length >= 2){
                video_game_2 = game_data[0]['name'];
            }

            let heading = document.getElementById('heading');

            if (video_game_1 == null || video_game_1 == "") {
                video_game_1 = '...';
            }
            if (heading){
                heading.innerHTML = 'Comparing "' + video_game_1 + '" to "' + video_game_2 +  '":';
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    }
}

function loadGameBasic(url, div){
    let game_data = [];
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(result){
        if (Object.keys(result).length >= 2){

            game_data.push({
                'name':result[0]['name'],
                'year_of_release': result[0]['year_of_release'],
                'genre':result[0]['genre'],
                'publisher':result[0]['publisher'],
                'rating': result[0]['rating']
            });
            //saving information to game_data as well so we can use it after the
            //results go away after the fetch.
            for (var i = 1; i < Object.keys(result).length; i++){
                game_data.push({
                    'platform':result[i]['platform'],
                    'na_sales': result[i]['na_sales'],
                    'eu_sales':result[i]['eu_sales'],
                    'jp_sales':result[i]['jp_sales'],
                    'other_sales': result[i]['other_sales'],
                    'global_sales': result[i]['global_sales'],
                    'critic_score': result[i]['critic_score'],
                    'critic_count': result[i]['critic_count'],
                    'user_score': result[i]['user_score'],
                    'user_count': result[i]['user_count']
                });
            }
            displayComparisons(game_data, div);
            selectPlatforms(game_data, div);
        } else {
            selectPlatforms([], div);
            loadGamePlatform(url, div);
            let game_basic_info = document.getElementById('basic-game-info'+div);
            if (game_basic_info){
                game_basic_info.innerHTML = "No results found. This game does not exist in the database.";
            }
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

function displayComparisons(game_data, div){
    let game_info = "";
    game_info +=  '<h2>' + game_data[0]['name'] + '</h2>' +
    '<p>Year Released: ' + game_data[0]['year_of_release'] + '</p>' +
    '<p>Genre: ' + game_data[0]['genre'] + '</p>' +
    '<p>Publisher: ' + game_data[0]['publisher'] + '</p>' +
    '<p>Rating: ' + game_data[0]['rating'] + '</p>';

    //actually displaying
    let game_basic_info = document.getElementById('basic-game-info'+div);
    if (game_basic_info){
        game_basic_info.innerHTML = game_info;
    }

}

function selectPlatforms(game_data, div){
    let platformSelection = '<option value="' + '-' + '"> '
                            + '-'
                            + ' </option>\n';
    for (let i = 1; i < game_data.length; i++) {
        let platform = game_data[i]['platform'];
        platformSelection += '<option value="' + platform + '"> '
                            + platform
                            + ' </option>\n';
    }
    platformSelection+= "</select>";

    let platforms = document.getElementById('platform-selector'+div);
    if (platforms) {
        platforms.innerHTML = platformSelection;
    }
}

function loadGamePlatform(url, div){
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(game_data){
        let platformVersion = "";
        if (Object.keys(game_data).length >= 2){
            //saving information to game_data as well so we can use it after the
            //results go away after the fetch.
            platform = document.getElementById('platform-selector' + div).value;

            for (let i = 1; i < game_data.length; i++){
                if (game_data[i]['platform'] == platform){
                    platformVersion+= '<h2>' + game_data[i]['platform'] + ' Version </h2>' +
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
            }
        } else {
            platformVersion = "";
        }

        let platformHTML = document.getElementById('platform-game-info'+div);
        if (platformHTML) {
            platformHTML.innerHTML = platformVersion;
        }

    })
    .catch(function(error) {
        console.log(error);
    });
}

function loadBasicComparisons() {
    let video_game_1 = document.getElementById('game_left').value;
    let video_game_2 = document.getElementById('game_right').value;

    let url;
    if (video_game_1 != "" && video_game_1 != null){
        url = getBaseURL() + '/api/get_game/' + video_game_1;
        loadGameBasic(url, 1);
    }

    if (video_game_2 != "" && video_game_2 != null){
        url = getBaseURL() + '/api/get_game/' + video_game_2;
        loadGameBasic(url, 2);
    }

    loadHeading(video_game_1, video_game_2);
}

function loadPlatformComparisons(div) {
    let video_game_1 = document.getElementById('game_left').value;
    let video_game_2 = document.getElementById('game_right').value;

    let url;
    if (video_game_1 != "" && video_game_1 != null && div == 1){
        url = getBaseURL() + '/api/get_game/' + video_game_1;
        loadGamePlatform(url, div);
    }

    if (video_game_2 != "" && video_game_2 != null && div == 2){
        url = getBaseURL() + '/api/get_game/' + video_game_2;
        loadGamePlatform(url, div);
    }
}
