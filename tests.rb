require './models'

puts Album.all.each do |a|
  puts a.name
end