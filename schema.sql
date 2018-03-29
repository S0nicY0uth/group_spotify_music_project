CREATE TABLE labels (
  id INTEGER NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE genres (
  id INTEGER NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE albums (
  id INTEGER NOT NULL,
  spotId VARCHAR,
  title TEXT NOT NULL,
  release_date DATE NOT NULL,
  upc_code VARCHAR(12) NOT NULL,
  label_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (label_id)  REFERENCES labels (id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id)  REFERENCES genres (id) ON DELETE CASCADE
);

CREATE TABLE tracks (
  id INTEGER NOT NULL,
  spotId VARCHAR,
  title TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE album_tracks (
  id INTEGER NOT NULL,
  album_id INTEGER NOT NULL,
  track_id INTEGER NOT NULL,
  track_no INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (album_id)  REFERENCES albums (id) ON DELETE CASCADE,
  FOREIGN KEY (track_id)  REFERENCES tracks (id) ON DELETE CASCADE
);

CREATE TABLE artists (
  id INTEGER NOT NULL,
  spotId VARCHAR,
  name TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE artists_tracks (
  id INTEGER NOT NULL,
  artist_id INTEGER NOT NULL,
  track_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (artist_id)  REFERENCES artists (id) ON DELETE CASCADE,
  FOREIGN KEY (track_id)  REFERENCES tracks (id) ON DELETE CASCADE
);



  