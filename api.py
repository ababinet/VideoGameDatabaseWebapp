'''
Dani Bottiger & Alia Babinet
CS 257 SOFTWARE DESIGN - Fall 2021
Video Games API
'''

import sys
import argparse
import flask
import json
import psycopg2

from config import password
from config import database
from config import user
from config import port


api = flask.Blueprint('api', __name__,)

def get_connection():
    ''' Returns a connection to the database described in the
        config module. May raise an exception as described in the
        documentation for psycopg2.connect. '''
    return psycopg2.connect(database=database,
                            user=user,
                            password=password,
                            port=port)

@api.route('/api/help')
def get_api_help():
    with open('api_help.txt', 'r') as api_help:
        return flask.render_template('api_help.html', text = api_help.read())


@api.route('/api/bestgames/')
def get_best_games():

    query = '''SELECT DISTINCT video_games.name, video_games.year_of_release, genres.genre, max(video_game_versions.critic_score) AS critic_score, publishers.publisher
                FROM video_games, video_game_versions, publishers, genres
                WHERE video_game_versions.video_game_id = video_games.id
                AND video_games.genre_id = genres.id
                AND video_games.publisher_id = publishers.id
                GROUP BY video_games.name, video_games.year_of_release, genres.genre, publishers.publisher
                ORDER BY critic_score DESC, video_games.name DESC LIMIT 20;
            '''

    video_game_list = []
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query, tuple())
        for row in cursor:
            video_game = {'name':row[0],
                      'year_of_release':row[1],
                      'genre':row[2],
                      'critic_score':row[3],
                      'publisher':row[4]}
            video_game_list.append(video_game)
        cursor.close()
        connection.close()
    except Exception as e:
        print(e, file=sys.stderr)

    return json.dumps(video_game_list)

@api.route('/api/search/<video_game>')
def get_search_results(video_game):
    try:
        connection = get_connection()
    except Exception as e:
        print(e)
        exit()

    video_game_list = []
    try:
        cursor = connection.cursor()

        query = '''SELECT video_games.name, video_games.year_of_release
                FROM video_games
                '''
        query += ' WHERE UPPER(video_games.name) LIKE UPPER(\'%' + video_game + '%\') ORDER BY name = \'' + video_game + '\', UPPER(\'' + video_game + '\');'
        cursor.execute(query)

        for row in cursor:
            video_game_dict = {
                'name':row[0],
                'year_of_release':row[1]
                }
            video_game_list.append(video_game_dict)

        cursor.close()
        connection.close()

    except Exception as e:
        print(e, file=sys.stderr)

    return json.dumps(video_game_list)

@api.route('/api/get_game/<video_game>')
def get_game(video_game):
    try:
        connection = get_connection()
    except Exception as e:
        print(e)
        exit()

    video_game_list = []
    try:
        video_game_dict = {}
        cursor = connection.cursor()

        query = '''SELECT video_games.id, video_games.name, video_games.year_of_release,
                genres.genre, publishers.publisher, video_games.rating
                FROM video_games, publishers, genres
                WHERE video_games.genre_id = genres.id
                AND video_games.publisher_id = publishers.id
                '''
        query += 'AND UPPER(video_games.name) LIKE UPPER(\'%' + video_game + '%\') ORDER BY name = \'' + video_game + '\', UPPER(\'' + video_game + '\') LIMIT 1;'
        cursor.execute(query)
        for row in cursor:
            video_game_dict = {
                'id':row[0],
                'name':row[1],
                'year_of_release':row[2],
                'genre':row[3],
                'publisher':row[4],
                'rating': row[5]
                }

        video_game_list.append(video_game_dict)

        version_query = ''' SELECT DISTINCT video_game_versions.id, video_games.name, platforms.platform, video_game_versions.na_sales, video_game_versions.eu_sales,
                            video_game_versions.jp_sales, video_game_versions.other_sales, video_game_versions.global_sales, video_game_versions.critic_score, video_game_versions.ciritc_count,
                            video_game_versions.user_score, video_game_versions.user_count
                            FROM video_game_versions, video_games, platforms
                            WHERE video_game_versions.platform_id = platforms.id
                            AND video_game_versions.video_game_id = video_games.id
                        '''
        version_query += ' AND video_games.name = \'' + str(video_game_dict.get('name')) + '\' ORDER BY video_game_versions.id;'
        cursor.execute(version_query)
        for row in cursor:
            video_game_version = {
                'id':row[0],
                'name':row[1],
                'platform':row[2],
                'na_sales':row[3],
                'eu_sales':row[4],
                'jp_sales':row[5],
                'other_sales':row[6],
                'global_sales':row[7],
                'critic_score':row[8],
                'critic_count':row[9],
                'user_score':row[10],
                'user_count':row[11]
            }
            video_game_list.append(video_game_version)

        cursor.close()
        connection.close()

    except Exception as e:
        print(e, file=sys.stderr)

    return json.dumps(video_game_list)

@api.route('/api/recommendations/<video_game>')
def get_similar_games(video_game):
    try:
        connection = get_connection()
    except Exception as e:
        print(e)
        exit()

    try:
        video_game_list = []
        cursor = connection.cursor()

        video_game_genre_id_query = """SELECT genre_id
                                    FROM video_games
                                    WHERE UPPER(name)
                                    LIKE UPPER(\'%""" + video_game + """%\')
                                    ORDER BY name = \'""" + video_game + '\', UPPER(\'' + video_game + """\')
                                    LIMIT 1;"""

        video_game_genre_id = ""
        cursor.execute(video_game_genre_id_query)
        for row in cursor:
            video_game_genre_id = row[0]

        video_game_rating_query = """SELECT rating
                                    FROM video_games
                                    WHERE UPPER(name)
                                    LIKE UPPER(\'%""" + video_game + """%\')
                                    AND NOT rating = \'\'
                                    ORDER BY name = \'""" + video_game + '\', UPPER(\'' + video_game + """\')
                                    LIMIT 1;"""

        video_game_rating = ""
        cursor.execute(video_game_rating_query)
        for row in cursor:
            video_game_rating = row[0]

        query = '''SELECT DISTINCT video_games.name, video_games.year_of_release,
                genres.genre, max(video_game_versions.critic_score) as critic_score, publishers.publisher, video_games.rating
                FROM video_games, video_game_versions, publishers, genres
                WHERE video_game_versions.video_game_id = video_games.id
                AND video_games.genre_id = genres.id
                AND video_games.publisher_id = publishers.id
                '''

        ### Genre Search
        if video_game_genre_id != "":
            query += ' AND video_games.genre_id = ' + str(video_game_genre_id)
        if video_game_rating != "":
            query += ' AND (video_games.rating = \'' + str(video_game_rating) + '\''
            query += ' OR video_games.rating = \'\')'



        ### Order and Limit
        query += ' GROUP BY video_games.name, video_games.year_of_release, genres.genre, publishers.publisher, video_games.rating '
        query += ' ORDER BY critic_score DESC, video_games.name LIMIT 10;'

        cursor.execute(query, tuple())
        for row in cursor:
            video_game = {'name':row[0],
                      'year_of_release':row[1],
                      'genre':row[2],
                      'critic_score':row[3],
                      'publisher':row[4],
                      'rating': row[5]}
            video_game_list.append(video_game)
        cursor.close()
        connection.close()

    except Exception as e:
        print(e, file=sys.stderr)

    return json.dumps(video_game_list)


@api.route('/api/years/')
def get_years():
    query = ''' SELECT DISTINCT year_of_release
                FROM video_games
                ORDER BY year_of_release ASC;
            '''

    year_list = []
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query, tuple())
        for row in cursor:
            year_list.append(row[0])
        cursor.close()
        connection.close()
    except Exception as e:
        print(e, file=sys.stderr)

    return json.dumps(year_list)

## localhost:5000/api/rankings/<limit>?year=year
@api.route('/api/rankings/<limit>')
def get_rankings(limit):
    try:
        connection = get_connection()
    except Exception as e:
        print(e)
        exit()

    try:
        video_game_list = []
        cursor = connection.cursor()
        year = flask.request.args.get('year', default="")
        print(year)
        if year == 'All Time':
            year = ''

        query = '''SELECT DISTINCT video_games.name, video_games.year_of_release, genres.genre, max(video_game_versions.critic_score) AS critic_score, publishers.publisher
                FROM video_games, video_game_versions, publishers, genres
                WHERE video_game_versions.video_game_id = video_games.id
                AND video_games.genre_id = genres.id
                AND video_games.publisher_id = publishers.id '''

        ### Rank by Year
        if year != '':
            query += 'AND video_games.year_of_release = ' + year

        ### Order and Limit
        query += ' GROUP BY video_games.name, video_games.year_of_release, genres.genre, publishers.publisher '
        query += ' ORDER BY critic_score DESC, video_games.name LIMIT ' +  limit + ';'

        cursor.execute(query, tuple())
        for row in cursor:
            video_game = {'name':row[0],
                      'year_of_release':row[1],
                      'genre':row[2],
                      'critic_score':row[3],
                      'publisher':row[4]}
            video_game_list.append(video_game)
        cursor.close()
        connection.close()

    except Exception as e:
        print(e, file=sys.stderr)

    return json.dumps(video_game_list)

if __name__ == '__main__':
    try:
        connection = psycopg2.connect(database=database, user=user, password=password, port=port)
    except Exception as e:
        print(e)
        exit()

    cursor = connection.cursor()

    parser = argparse.ArgumentParser('A olympic database Flask application/API')
    parser.add_argument('host', help='the host on which this application is running')
    parser.add_argument('port', type=int, help='the port on which this application is listening')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True)
