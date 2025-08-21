CREATE DATABASE IF NOT EXISTS flixy;

USE flixy;

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE movies (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(128) NOT NULL,
  year int NOT NULL,
  imdb_rating float NOT NULL,
  genres varchar(255) NOT NULL,
  countries varchar(128) NOT NULL,
  duration int NOT NULL,
  cast varchar(512) NOT NULL,
  directors varchar(512) NOT NULL,
  writers varchar(512) NOT NULL,
  plot varchar(2048) NOT NULL,
  logo_url varchar(512) NOT NULL,
  youtube_trailer_id varchar(45) DEFAULT NULL,
  is_trailer_reliable tinyint DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE reviews (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  movie_id int NOT NULL,
  rating int DEFAULT NULL,
  text varchar(1024) DEFAULT NULL,
  watch_date timestamp NULL DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY user_id (user_id, movie_id),
  KEY movie_id (movie_id),
  CONSTRAINT reviews_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT reviews_ibfk_2 FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);

CREATE TABLE watchlists (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  name varchar(256) NOT NULL,
  description varchar(1024) DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (name),
  CONSTRAINT watchlists_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE watchlist_movies (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  watchlist_id int NOT NULL,
  movie_id int NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY watchlist_id (watchlist_id, movie_id),
  CONSTRAINT watchlist_movies_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT watchlist_movies_ibfk_2 FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  CONSTRAINT watchlist_movies_ibfk_3 FOREIGN KEY (watchlist_id) REFERENCES watchlists (id) ON DELETE CASCADE
);

