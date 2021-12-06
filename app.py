'''
Dani Bottiger & Alia Babinet
CS 257 SOFTWARE DESIGN - Fall 2021
Video Games API
'''

import sys
import argparse
import flask
import api


app = flask.Flask(__name__, static_folder='static', template_folder='template')
app.register_blueprint(api.api, url_prefix='/')

@app.route('/')
def get_home():
    return flask.render_template('home.html')

@app.route('/recommendations/')
def get_recommendations():
    return flask.render_template('recommendations.html')

@app.route('/rankings/')
def get_rankings_page():
    return flask.render_template('rankings.html')

@app.route('/comparisons/')
def get_comparisons():
    return flask.render_template('comparisons.html')

@app.route('/about/')
def get_about():
    return flask.render_template('about.html')

@app.route('/search/')
def get_search():
    return flask.render_template('search.html')

@app.route('/game/')
def get_game_page():
    return flask.render_template('game.html')

@app.route('/api/help')
def get_api_help():
    with open('api_help.txt', 'r') as api_help:
        return flask.render_template('api_help.html', text = api_help.read())

if __name__ == '__main__':

    parser = argparse.ArgumentParser('A olympic database Flask application/API')
    parser.add_argument('host', help='the host on which this application is running')
    parser.add_argument('port', type=int, help='the port on which this application is listening')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True)
