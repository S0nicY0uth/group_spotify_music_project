require 'active_record'

ActiveRecord::Base.establish_connection(
  :adapter => 'sqlite3',
  :database => 'music.db'
)

ActiveRecord::Base.logger = Logger.new(STDOUT)

class Album < ActiveRecord::Base
  belongs_to :label
  belongs_to :genre
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
  has_and_belongs_to_many :tracks
  validates :name, presence: true, uniqueness: true
end

class Genre < ActiveRecord::Base
  has_many :albums
  belongs_to :album
end

class Track < ActiveRecord::Base
  has_and_belongs_to_many :artists
  def to_s
    myArtists = artists.map(&:name).join(',')
    "#{myArtists} - #{title}"
  end
end
