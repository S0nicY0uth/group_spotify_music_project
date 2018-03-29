crucial express

Music Database
==============

This is a programming exercise based around a database of albums, tracks and artists. You can create your local copy of the database with:

`sqlite3 music.db < schema.sql`

Then load the (empty) database with:

`sqlite3 music.db`

You can view the schema of the database now using:

`.schema`

Next steps
==========

## Seed the database

In the file `seeds.sql` place some SQL INSERT statements to add some albums and all related data. You can either try to pull this from a real source (e.g. Spotify) and use a script to turn it into SQL statements or just hand code it yourself manually. You will need to insert these in the correct order so you are not referring to data that does not exist. Once you have created this file, insert the data using the command:

`sqlite3 music.db < seeds.sql`

## Query the database

Here are a few things you should try out:

1. List all tracks for an album in track number order
2. List all albums for a label
3. List all genres for an album
4. List all genres for an artist
5. List all albums for an artist
6. List how many albums each artist has created
7. List how many albums each label has published
