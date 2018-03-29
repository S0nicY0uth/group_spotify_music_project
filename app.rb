require './models'
require 'rspotify'
require 'json'

RSpotify.authenticate("9d99238a67fb4bb29bd9fbb2940301a2", "fc93986e68c444959875a1053d8a4296")

options = ['Create','Close']
createOptions = ['Add Artist', 'Add Album', 'Home']
def displayOptions(options)
  puts 'What would you like to do?'
  options.each_with_index do |o,i|
    puts "#{i} - #{o}"
  end
  option = gets.chomp
end

def uniqueValue(table,input,field)
  table.find_by(field)
end

def find_or_create_record(table,input,questions)
  if Artist.exists?(input)
    return getForeignKey(table,input)
  else
    questions.each do |key,value|
      puts value
      userinput = gets.chomp
      questions[key] = userinput
    end
    questions = questions.merge!(input)
    a = table.create!(questions)
    puts "Created #{a.name}"
    return a.id
  end
end

def getForeignKey(table,hash)
  table.find_by(hash).id
end

run = true
while run
  option = displayOptions(options)
  case option
  when '0'
    create = true
    while create
      subOption = displayOptions(createOptions)
      case subOption
      when '0'
        puts "please enter the artist name"
        name = gets.chomp
        output = find_or_create_record(Artist,{name: name},{country: 'please enter a country'})
        puts output.class
        if output.class == Fixnum
          puts "Artist Exists"
        else
          puts "Artist Added"
        end
      when '1'
        puts "please enter the title for the album"
        title = gets.chomp
        albums = RSpotify::Album.search(title).to_a
        puts "please choose an album by its number..."
        albums.each_with_index do |a, i|
          a.artists.each do |b|
            puts "#{i} - #{b.name} - #{a.name}"
          end
        end
        abm_i = gets.chomp.to_i
        album_name = albums[abm_i].name
        release_date = albums[abm_i].release_date
        albums[abm_i].artists.each do |a|
          puts a.name
        end
        label = albums[abm_i].label
        puts albums[abm_i].external_ids
        tracknames = albums[abm_i].tracks.map {|t| puts t.external_ids }
        puts "please enter a genre"
        genre = gets.chomp

        # puts "please enter the ablbums release date"
        # release_date = gets.chomp
        # puts "please enter the label for the record"
        # label = gets.chomp
      when '2'
        create = false
      end
    end
  when '1'
    run = false
  end
end
