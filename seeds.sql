INSERT INTO labels VALUES
(1, "Sony"),
(2, "Abby Records"),
(3, "Broken Records"),
(4, "Hell etc.")
;

INSERT INTO genres VALUES
(1, "Punk"),
(2, "Pop"),
(3, "Metal"),
(4, "Screemo"),
(5, "Classical"),
(6, "Easy Listening"),
(7, "Rock")
;

INSERT INTO artists VALUES
(1, "Britney", "USA"),
(2, "Spice Girl", "UK"),
(3, "Tatu", "Russia"),
(4, "Baby Metal", "Japan"),
(5, "Wallabies", "Australia")
;
-- Foreign Key = Label_id
INSERT INTO albums VALUES
(1, "Begginings", "2015-09-14", "123456789012", 1,4),
(2, "Happy Endings", "2012-02-14", "123456789012", 4,5),
(3, "I spit on your grave", "2016-06-06", "123456789012", 3,2),
(4, "Your mother's got a penis", "2004-05-12", "123456789012", 3,6),
(5, "New shiz", "2018-03-27", "123456789012", 3,1),
(6, "Slightly More PC", "2004-05-12", "123456789012", 3,3),
(7, "It just gets better", "2004-05-12", "123456789012", 3,2),
(8, "Yeah, done", "2004-05-12", "123456789012", 3,1),
(9, "Boaty McBoatface", "1999-01-27", "123456789012", 3,5)
;
-- Foreign Key = Genre_id
INSERT INTO tracks VALUES
(1, "Needle mans"),
(2, "Double Rainbow"),
(3, "Dementia"),
(4, "Pretty Happy Flowers"),
(5, "Mother's seconds"),
(6, "Tom's Chode"),
(7, "Amy's Flat Chest"),
(8, "Creative juices gone dry")
;
-- Foreign Key = album_id, track_id
-- Last number = track_no
INSERT INTO album_tracks VALUES
(1, 1, 1, 1),
(2, 2, 2, 1),
(3, 3, 3, 1),
(4, 4, 4, 1),
(5, 4, 5, 2),
(6, 4, 6, 3),
(7, 4, 7, 4),
(8, 9, 8, 1)
;
-- Foreign Key = artist_id, track_id
INSERT INTO artists_tracks VALUES
(1, 1, 3),
(2, 4, 4),
(3, 3, 1),
(4, 2, 2),
(5, 5, 5),
(6, 5, 6),
(7, 5, 7),
(8, 5, 8)
;
