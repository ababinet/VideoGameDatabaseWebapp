AUTHORS: Dani Bottiger & Alia Babinet

DATA: This is a database of video games and their scores, ratings, sales, and other information covering all games that sold over 100k copies from 1976 to January 2017.

FEATURES CURRENTLY WORKING:
	- Home Page: Displays the top 20 games of all time.
	- Recommendations: Search for games of the same genre and rating depending on your input. Games with no rating will show up too because the database lacks some information.
	- Rankings: Display the best games from all time or from a given year and choose how many display.
	- About: Who made this and why? Find out there!
	- Search: Get search results and be able to see information about just 1 game.
	- Comparisons: Search two games and get their metacritic scores, sales, and more.

HOW TO RUN:
Dani's computer is a bit funky, because of that, your config.py will need to be a bit funky as well. The only difference is the addition of a specified port. Our psycopg2.connect will be looking for that port, so you'll need it.
Please format your config.py like this:

	database = 'video_games'
	user = 'your_username'
	password = 'your_password'
	port = 5432

For easiness, here is the SQL command to load the database:
	psql -U my_user_name video_games < data.sql
