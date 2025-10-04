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
  likes int DEFAULT 0,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  visible_updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
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

CREATE TABLE review_likes (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  review_id int NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY user_id (user_id, review_id),
  CONSTRAINT review_likes_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT review_likes_ibfk_2 FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE
);

CREATE TABLE user_relationships (
  id int NOT NULL AUTO_INCREMENT,
  follower_id int NOT NULL,
  followed_id int NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY follower_id (follower_id, followed_id),
  CONSTRAINT user_relationships_ibfk_1 FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT user_relationships_ibfk_2 FOREIGN KEY (followed_id) REFERENCES users (id) ON DELETE CASCADE
);

-- unlock_conditions
-- {
--   "target_field": "reviews_count",
--   "value": 10,
-- }
CREATE TABLE achievements (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(128) NOT NULL,
  description varchar(512) NOT NULL,
  icon_name varchar(64) NOT NULL,
  color varchar(45) NOT NULL,
  unlock_conditions JSON NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (name)
);

-- Achievements
INSERT INTO achievements (name, description, icon_name, color, unlock_conditions)
VALUES
('Prolific Critic', 'More than 200 reviews written', 'BookOpen', 'purple',
 '{"target_field": "total_reviews", "value": 200}'),

('Spotlight Reviewer', 'More than 20 likes on one review', 'Sparkles', 'yellow',
 '{"target_field": "most_liked_review_likes", "value": 20}'),

('Movie Marathon', 'More than 1000 movies watched', 'Eye', 'blue',
 '{"target_field": "total_movies_watched", "value": 1000}'),

('Dedicated Cinephile', 'More than 3000 hours watched', 'Clock', 'green',
 '{"target_field": "total_time_watched", "value": 3000}');


CREATE TABLE user_achievements (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  achievement_id int NOT NULL,
  unlocked_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY user_id (user_id, achievement_id),
  CONSTRAINT user_achievements_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT user_achievements_ibfk_2 FOREIGN KEY (achievement_id) REFERENCES achievements (id) ON DELETE CASCADE
)
