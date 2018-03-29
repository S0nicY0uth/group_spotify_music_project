require 'rspotify'
require 'json'

RSpotify.authenticate("9d99238a67fb4bb29bd9fbb2940301a2", "fc93986e68c444959875a1053d8a4296")
artists = RSpotify::Artist.search('Arctic Monkeys')

# Now you can access playlists in detail, browse featured content and more

me = RSpotify::User.find('11126629320')

# playlist = RSpotify::Playlist.find('djfreshmusicuk', '7aZuWmYChm3FiZzYXLVL6a')
# artist = ''
# playlist.tracks.each do |t|
#   track = t.name
#   t.artists.each do |a|
#     artist += a.name
#   end
#   puts "artist:#{artist} track:#{track}"
#   artist = ''
# end

playlist = RSpotify::Playlist.find('11126629320', '39Vk2mLYQvL9idGS9sVGzJ')
artist = ''
albumtitles = []
artists = []

playlist.tracks.each do |t|
  t.artists.each do |a|
    artists.push(a.name)
  end
end

playlist.tracks.each_with_index do |t,i|
  albumdetails = {}
  albumdetails['artist'] = artists[i]
  albumdetails['name'] = t.album.name
  albumdetails['release_date'] = t.album.release_date
  albumtitles.push(albumdetails)
end

p albumtitles


puts "INSERT INTO artists VALUES"
artists.each_with_index do |a,i|
  puts "(#{i},\'#{a}\','UK'),"
end
