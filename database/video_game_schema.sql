CREATE TABLE publishers (
	id integer,
	publisher text
);

CREATE TABLE genres (
	id integer,
	genre text
);

CREATE TABLE platforms (
	id integer,
	platform text
);

CREATE TABLE video_games (
	id integer,
	name text,
	year_of_release integer,
	genre_id integer,
	publisher_id integer,
	rating text
);

CREATE TABLE video_game_versions (
	id integer,
	video_game_id integer,
	platform_id integer,
	na_sales float,
	eu_sales float,
	jp_sales float,
	other_sales float,
	global_sales float,
	critic_score float,
	ciritc_count integer,
	user_score float,
	user_count integer
);