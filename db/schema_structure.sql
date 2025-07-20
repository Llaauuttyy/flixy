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
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
