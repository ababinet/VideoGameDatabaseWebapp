'''
Dani Bottiger & Alia Babinet
CS 257 SOFTWARE DESIGN - Fall 2021
Convert Video Game Database

convert_video_game_database takes "Video_Game_Sales_as_of_Jan_2017.csv" and breaks it up into 
multiple csv files to then be transferred into a SQL database.

Database from https://www.kaggle.com/kendallgillies/video-game-sales-and-ratings

'''

import csv

'''
Columns in video_game_raw:
0       1           2                       3       4           5           6           7
Name    Platform    Year_of_Release Genre   Genre   Publisher   NA_Sales    EU_SALES    JP_SALES

8           9               10              11              12          13          14
Other_Sales Global_Sales    Critic_Score    Critic_Count    User_Score  User_Count  Rating
'''

class video_game_db:
    def __init__(self, csv_database=[]):
        video_game_raw = self.read_csv_file(csv_database)
        print('Reading of "Video_Game_Sales_as_of_Jan_2017.csv" is complete')

        publisher_list = self.write_publisher_csv(video_game_raw)
        print('Writing of "publishers.csv" is complete')

        genre_list = self.write_genre_csv(video_game_raw)
        print('Writing of "genres.csv" is complete')

        platform_list = self.write_platform_csv(video_game_raw)
        print('Writing of "platforms.csv" is complete')

        video_game_list = self.write_video_game_csv(video_game_raw, genre_list, publisher_list)
        print('Writing of "video_games.csv" is complete')

        video_games_versions_list = self.write_video_game_version_csv(video_game_raw, video_game_list, platform_list)
        print('Writing of "video_game_versions.scv" is complete')



    def read_csv_file(self, csv_file=''):
        file = open(csv_file)
        csvreader = csv.reader(file)
        raw_dictionary = []
        for row in csvreader:
            raw_dictionary.append(row)
        file.close()
        raw_dictionary.pop(0) # We don't need our headers
        return raw_dictionary

    def write_publisher_csv(self, raw_dictionary):
        '''
        Data in publisher_list:
            ID
            Publisher
        '''
        publisher_list = []
        for row in raw_dictionary:
            temp_publisher = {}

            if not any(publisher.get("publisher") == row[4] for publisher in publisher_list):
                temp_publisher = {
                    "ID" : len(publisher_list) + 1,
                    "publisher" : row[4]
                }
                publisher_list.append(temp_publisher)

        with open('publishers.csv', 'w') as publishers_file:
            writer = csv.writer(publishers_file)
            for row in publisher_list:
                writer.writerow(row.values())

        return publisher_list

    def write_genre_csv(self, raw_dictionary):
        '''
        Data in genre_list:
            ID
            Genre
        '''
        genre_list = []
        for row in raw_dictionary:
            temp_genre = {}

            if not any(genre.get("genre") == row[3] for genre in genre_list):
                temp_genre = {
                    "ID" : len(genre_list) + 1,
                    "genre" : row[3]
                }
                genre_list.append(temp_genre)
            
        with open('genres.csv', 'w') as genres_file:
            writer = csv.writer(genres_file)
            for row in genre_list:
                writer.writerow(row.values())
        
        return genre_list

    def write_platform_csv(self, raw_dictionary):
        '''
        Data in platform_csv:
            ID
            Platform
        '''
        platform_list = []
        for row in raw_dictionary:
            temp_platform = {}

            if not any(platform.get("platform") == row[1] for platform in platform_list):
                temp_platform = {
                    "ID" : len(platform_list) + 1,
                    "platform" : row[1]
                }
                platform_list.append(temp_platform)
            
        with open('platforms.csv', 'w') as platforms_file:
            writer = csv.writer(platforms_file)
            for row in platform_list:
                writer.writerow(row.values())
        
        return platform_list

    def write_video_game_csv(self, raw_dictionary, genre_list, publisher_list):
        '''
        Data in video_game_csv:
            ID
            Name
            Year of Release
            Genre ID
            Publisher ID
            Rating
        '''
        video_game_list = []
        for row in raw_dictionary:
            temp_video_game = {}

            if not any(video_game.get("name") == row[0] for video_game in video_game_list):
                ## Getting genre_ID
                genre_ID = next(item for item in genre_list if item.get("genre") == row[3]).get("ID")

                ## Getting publisher_ID
                publisher_ID = next(item for item in publisher_list if item.get("publisher") == row[4]).get("ID")

                ## Some year_of_release are N/A, let's make them Null instead
                if row[2] != 'N/A':
                    year_of_release = row[2]

                temp_video_game = {
                    "ID" : len(video_game_list) + 1,
                    "name" : row[0],
                    "year_of_release" : year_of_release,
                    "genre_ID" : genre_ID,
                    "publisher_ID" : publisher_ID,
                    "rating" : row[14]
                }
                video_game_list.append(temp_video_game)
            
        with open('video_games.csv', 'w') as video_games_file:
            writer = csv.writer(video_games_file)
            for row in video_game_list:
                writer.writerow(row.values())
        
        return video_game_list

    def write_video_game_version_csv(self, raw_dictionary, video_game_list, platform_list):
        '''
        Data in video_game_version_csv:
            ID
            Video Game ID
            Platform ID

            NA_Sales
            EU_Sales
            JP_Sales
            Other_Sales
            Global_Sales

            Critic_Score
            Critic_Count
            User_Score
            User_Count
        '''

        video_game_version_list = []
        for row in raw_dictionary:

            ## Getting video_game_ID
            video_game_ID = next(item for item in video_game_list if item.get("name") == row[0]).get("ID")

            ## Getting platform_ID
            platform_ID = next(item for item in platform_list if item.get("platform") == row[1]).get("ID")

            ## Some information is non-existence sometimes, let's make them Null instead
            if row[5] != '':
                na_sales = row[5]
            if row[6] != '':
                eu_sales = row[6]
            if row[7] != '':
                jp_sales = row[7]
            if row[8] != '':
                other_sales = row[8]
            if row[9] != '':
                global_sales = row[9]

            if row[10] != '':
                critic_score = row[10]
            if row[11] != '':
                critic_count = row[11]
            if row[12] != '':
                user_score = row[12]
            if row[13] != '':
                user_count = row[13]
            
            temp_video_game_version = {
                "ID" : len(video_game_version_list) + 1,
                "video_game_ID" : video_game_ID,
                "platform_ID" : platform_ID,
                "NA_Sales" : na_sales,
                "EU_Sales" : eu_sales,
                "JP_Sales" : jp_sales,
                "Other_Sales" : other_sales,
                "Global_Sales" : global_sales,
                "Critic_Score" : critic_score,
                "Critic_Count" : critic_count,
                "User_Score" : user_score,
                "User_Count" : user_count
            }

            video_game_version_list.append(temp_video_game_version)
        
        with open('video_game_versions.csv', 'w') as video_game_versions_file:
            writer = csv.writer(video_game_versions_file)
            for row in video_game_version_list:
                writer.writerow(row.values())
        
        return video_game_version_list

if __name__ == '__main__':
    print('Beginning to convert "Video_Game_Sales_as_of_Jan_2017.csv"')
    video_game_db = video_game_db('Video_Game_Sales_as_of_Jan_2017.csv')
    print('Done!')