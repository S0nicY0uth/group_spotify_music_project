require 'active_record'

ActiveRecord::Base.establish_connection(
  :adapter => 'sqlite3',
  :database => 'hiphop.db'
)

ActiveRecord::Base.logger = Logger.new(STDOUT)

class Album < ActiveRecord::Base
  belongs_to :label
  has_many :album_tracks
  has_many :tracks, through: :album_tracks

  def to_s
    title + ' ' + tracks.map { |track| track.to_s}.join('/n')
  end
end

class Label < ActiveRecord::Base
  has_many :albums
end

class AlbumTrack < ActiveRecord::Base
  belongs_to :album
  belongs_to :track
end

class Artist < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  has_and_belongs_to_many :tracks
    
  def genres
    Genre.select(:name).joins(tracks: :artists).where("artists.id = ?", id).distinct
  end
  
  def albums
    Album.joins(tracks: :artists).where("artists.id = ?", id).distinct
  end

end


class Track < ActiveRecord::Base
  has_and_belongs_to_many :artists
  has_many :albums, through: :album_tracks

  def to_s
    myArtists = artists.map(&:name).join(',')
    "#{myArtists} - #{title}"
  end
end

