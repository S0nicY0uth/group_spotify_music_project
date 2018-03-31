
var globalToken, tokenExpiry=0
var refresh_token = 'AQDxyxMb2JM7GiMgWu6A8PaREdLPz_9cVWeamxWrS3ZNUREH7LzsLse9zw7aj992ZWo2QyKCOb9DdoPSnyvjf1YdHaRsUEia063xhCg5UGZEjp9owf-vGWhh-ISO7Spn9Zs'
var rp = require('request-promise'), PORT = process.env.PORT || 3333, express = require('express'), app = express(), PromiseThrottle = require('promise-throttle');
var colours = require ('./lib/colours.js'), wait = require ('./lib/wait-promise.js')
var errorRespond = require ('./lib/error-respond.js'), client_id = '95b153c2907f41ba813e1b5ca3ebdae6', client_secret = 'f338d2a27716445184d8509c314516b5'; 
var fs = require('fs')
var fields = ['labels', 'artists', 'albums', 'tracks', 'album_tracks', 'artists_tracks'],buffer="",labelData="",nextIndex=null,labelDataToAdd="",chris_album_id={},chris_track_id={},chris_artist_id={},k=0
var genres = require('./lib/genre-codes')
var labelObject = require('./lib/label_ids')


var promiseThrottle = new PromiseThrottle({
    requestsPerSecond: 3,
    promiseImplementation: Promise
});

process.on('uncaughtException', (e) => {
    console.log(colours.BgRed, 'Error: Uncaught Exception ' + e)
})


function exists (buffer,element){
   return buffer.indexOf(element)==-1?false:true
}

Object.prototype.safe = function (path) {
 var that = this
    try {
        var reg = new RegExp ('(\\w+)\\[(\\d+)\\]') ;
        return path.split('.').reduce(function (prev, curr) {
            if (typeof prev != undefined && prev) {
                if (reg.test(curr)) {
                    return prev[reg.exec(curr)[1]] [reg.exec(curr)[2]]
                } else {
                    return prev[curr] == undefined ? null : prev[curr]
                }
            } else {
                return null
            }
        }, that || this )
    } catch (e) {
    return 'Error: Incorrect attributes in resolve function'
    }
}

function escQuotes(string){
    return typeof string !="undefined"?string.replace(/"/g, '\\\"'):"empty"
}

function rpSafe (options) {

    return new Promise((resolve, fail) => {

        if (tokenExpiry - new Date().getTime() <= 3000) {


            rp.post({

                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                form: {

                    grant_type: 'refresh_token',
                    refresh_token: refresh_token

                },

                json: true

            }, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    console.log (colours.BgRed, "Refreshed Token, Will expire in: " + body.expires_in)
                    globalToken = body.access_token
                    var exp = (Math.floor (body.expires_in / 60) * 7000)
                    tokenExpiry = new Date().getTime() + exp
                    resolve (rp (options))
                } else {
                    console.log (colours.FgRed, 'Error in refresh call\n')
                }
            })
        } else {
            resolve(rp(options))
        }

    })
}

function spotObj () {
   
  
    this.status= { text:null , colour:null }
    this.res = {},this.artist_name=[],this.artist_id=[]
   
    this.setPlaylistData = (object)=>{
         
            this.track_name=object.safe('track.name')
            this.track_id=object.safe('track.id')
            this.album_id=object.safe('track.album.id')
            if (object.track && object.track.artists){
            object.track.artists.forEach ((artist,i)=>{
            this.artist_name.push(object.safe('track.artists['+i+'].name'))
            this.artist_id.push(object.safe('track.artists['+i+'].id'))
            })}
            this.isrc=object.safe('track.external_ids.isrc')     
    }
    this.setAlbumData = (object)=>{
  
            this.upc=object.safe('external_ids.upc')
            this.label=object.safe('label')
            this.genre=object.safe('genres')
            this.album_title=object.safe('name')
            this.release_date=object.safe('release_date')
            this.res=null
        
    }

}

function spotifyCall (option, searchTerm) {


    this.searchTerm = searchTerm
    this.option = option
    this.urls = []

    this.getUrls = () => {
        return this.urls
    }

    this.optionsGetTokenFromRefresh = ()=>{
       var options = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
    
                grant_type: 'refresh_token',
                refresh_token: refresh_token
    
            }
        }
            return options
    }

    this.optionsGetAlbums = (id) => {
        var options = {

            url: 'https://api.spotify.com/v1/albums/'+id,
            resolveWithFullResponse: true,
            headers: {
                'Authorization': 'Bearer ' + globalToken,
            },
            json: true
        }
       
        return options
    }

    this.optionsGetTotal = (letter) => {
        var options = {

            url: 'https://api.spotify.com/v1/search?q=' + that.searchTerm + ' ' + letter + '*&type=playlist&limit=50&offset=0',
            resolveWithFullResponse: true,
            headers: {
                'Authorization': 'Bearer ' + globalToken,
            },
            json: true
        }
   
        return options


    }
    this.optionsGetUrls = (letter, offset) => {
        var options = {

            url: 'https://api.spotify.com/v1/search?q=' + that.searchTerm + ' ' + letter + '*&type=playlist&limit=50&offset=' + offset,
            headers: {
                'Authorization': 'Bearer ' + globalToken,
            },
            json: true
        }
        return options


    }
    this.optionsGetPlaylistsTracks = (splitUrl) => {
        
        var options = {

            url: 'https://api.spotify.com/v1/users/' + splitUrl[5] + '/playlists/' + splitUrl[7] + '/tracks',
            headers: {
                'Authorization': 'Bearer ' + globalToken
            },
            json: true
        }
        return options
        


    }
    this.optionsGetPlaylists = (href) => {

        var options = {

            url: 'https://api.spotify.com/v1/users/' + href.split('/')[5] + '/playlists/' + href.split('/')[7],
            headers: {
                'Authorization': 'Bearer ' + globalToken
            },
            json: true
        }
        return options
    }

    this.optionsGetTrackNames = (id) => {

        var options = {

            url: 'https://api.spotify.com/v1/tracks/' + id,
            headers: {
                'Authorization': 'Bearer ' + globalToken
            },
            json: true
        }
        return options


    }
    var that = this,
        ref = []

    this.multiCall = (array, total) => {

        switch (that.option) {

            case 'getSearchResultTotal':
                array.forEach((letter2, i) => {
                    ref[i] = rpSafe(that.optionsGetTotal(letter2,globalToken))
                })

                return new Promise((resolve, fail) => {
                    var remaining, resArray = []
                    remaining = ref.length

                    ref.forEach((call, i) => {

                        call.then(result => {

                            resArray[i] = result.body.playlists.total
                            remaining -=1 
                            !remaining? resolve(resArray) : null

                        }).then(() => {

                            return wait(300)

                        })
                    })
                });
                break

            case 'getTrackNames':

                var throt3 = function (i) {

                    var resArray = []
                    return new Promise(function (resolve, reject) {

                        rpSafe(that.optionsGetTrackNames(i)).then(res => {

                            resArray.push(i, res.name)

                            resolve(resArray)
                        }).catch(e => {
             
                            return errorRespond(e)
                        })
                    })
                }
                return new Promise((resolve, fail) => {

                    array.forEach((id, i) => {


                        ref.push(promiseThrottle.add(throt3.bind(this, id.split(':')[2])))

                    })
                    Promise.all(ref)

                        .then(function (r) {

                            r.forEach((item) => {
                                idName.push(item)
                                console.log(item)

                            })
                            resolve(idName)

                        }).then(function (idName) {
                            return idName
                        }).catch(e => {

                            console.log(colours.FgRed, 'Error searching ' + i + '* at Offset ' + j);
                           return errorRespond(e)
                        })
                })
                break;
            case 'getUrls':

                var throt2 = function (i, j) {

                    var resArray = []
                    return new Promise(function (resolve, reject) {

                       rpSafe(that.optionsGetUrls(i, j)).then(res => {
                            if (typeof res.playlists.items != "undefined") {
                                res.playlists.items.forEach((playlist) => {
                                    resArray.push(playlist.tracks.href)

                                })
                            }
                            resolve(resArray)
                        }).catch(e => {
                            errorRespond(e)
                            resolve(resArray)
                            console.log(colours.FgRed, 'Error searching ' + i + '* at Offset ' + j);
                          
                        })
                    })
                }
                return new Promise((resolve, fail) => {
//offset < Math.min(total[i], 10000)
                    array.forEach((letter, i) => {

                        for (offset = 0;offset<100; offset++) {
                            if (offset % 50 == 0) {

                                ref.push(promiseThrottle.add(throt2.bind(this, letter, offset)))
                            }
                        }
                    })
                    Promise.all(ref)

                        .then(function (r) {
                            var sendArray = []
                            r.forEach((item) => {
                                if (typeof item != "undefined") {
                                    item.forEach((url) => {
                                        sendArray.indexOf(url) == -1 ? sendArray.push(url) : null
                                    })
                                }

                            })
                            resolve(sendArray)

                        }).then(function (sendArray) {
                            return sendArray
                        }).catch(e => {
                            console.log(colours.FgRed, 'Error resolving .all getting search results');
                            errorRespond(e)
                            resolve(sendArray)
                            return sendArray
                      
                        })
                })
                break;

                case 'getAlbums':

                var throt = function (obj) {
       
                    return new Promise(function (resolve, reject) {
                      
                        if (obj.safe('album_id')){
                         
                      rpSafe(that.optionsGetAlbums(obj.album_id)).then(res => {
            
                          obj.res=res.body
                       
                            resolve(obj)
                    
                        }).catch(e => {
                            resolve(e)
                          
                        })}
                        else {
                            resolve(spotObj)
                        }
                    })
                }
                return new Promise((resolve, fail) => {

                    array.forEach((object) => {

                              typeof object!='undefined'?ref.push(promiseThrottle.add(throt.bind(this, object))):null
                    })
                    Promise.all(ref)

                        .then(function (r) {     
                              
                            resolve(r)

                        }).catch(e => {
                            errorRespond(e)
                            resolve(e)

                      
                        })
                })
                break;

            case 'getPlaylistsTracks':

                var count = []
                var throt3 = function (i) {
                    
                    return new Promise(function (resolve, reject) {
                    
                     rpSafe(that.optionsGetPlaylistsTracks(i)).then(res => {
                            resolve(res)

                        }).catch(e => {
                           console.log(colours.FgRed, 'Error  with ' + JSON.stringify(i));
                            errorRespond(e) 
                            resolve(e)
                         
                        })
                    })
                }
                var check = false;
                return new Promise((resolve, fail) => {
                    array.forEach((url, i) => {
                    ref.push(promiseThrottle.add(throt3.bind(this, url.split('/'))))
                    })
                    Promise.all(ref)
                        .then(function (r) {                          
                            resolve(r)
                        }).catch(e => {
                            console.log(colours.FgRed, 'Error resolving .all getting playlists Urls');
                          errorRespond(e)
                          resolve(e)
                        })
                })
                break;
        }
    }
}



var getTotals = new spotifyCall('getSearchResultTotal', process.argv[2])
var getUrls = new spotifyCall('getUrls', process.argv[2])
var getPlaylists = new spotifyCall('getPlaylistsTracks')
var getAlbums = new spotifyCall('getAlbums')
rp.post({
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {

        grant_type: 'refresh_token',
        refresh_token: refresh_token

    },

    json: true
}, (error, response, body) => {

    globalToken = body.access_token
    tokenExpiry = new Date() + (Math.floor(body.expires_in / 60) * 10000)


}).then(() => {
    return fs.readFile('./lib/label_ids.js', 'utf8', function (err, data) {
        labelData = data;
    })
}).then(() => {


    return getTotals.multiCall(['a', 'b'])
}).then((res) => {
    return getUrls.multiCall(['a', 'b'], [1, 1])

}).then((res) => {
    return getPlaylists.multiCall(res)
}).then((res) => {
    var spotObjPLpop = [],
        temp = []

    res.forEach((items, i) => {

        if (typeof items.items != 'undefined') {
            items.items.forEach((playlist, j) => {
                temp[i + j] = new spotObj()
                temp[i + j].setPlaylistData(playlist)
            })
        }
    })
    return getAlbums.multiCall(temp)

}).then((spotObj) => {
    var inc = 0
    labelData = labelData.substring(0, labelData.length - 1)

    spotObj.forEach((item) => {
        typeof item == 'object' ? item.setAlbumData(item.res) : null
    })

    fields.forEach((field, i) => {
        k = 0
        buffer += `INSERT INTO ${field} VALUES\n`
        spotObj.forEach((res, i) => {
            typeof res.genre == 'undefined' ? res.genre = [] : null
            res.genre.forEach(() => {
                typeof res.genre == 'undefined' ? res.genre = 'empty' : null
            })

            if (labelData.indexOf(res.label) == -1 && labelDataToAdd.indexOf(res.label) == -1) {
                nextIndex = labelData.split(':')[labelData.split(':').length - 1].substring(0, labelData.split(':')[labelData.split(':').length - 1].length - 1)
                inc++
                nextIndex = parseInt(nextIndex) + inc
                labelObject[res.label] = nextIndex
            }
            // This is a bit of a mess please feel free to tidy up i ran out of time!

            switch (field) {


                case 'labels':
                    if (i < (spotObj.length - 1)) {
                        if (labelData.indexOf(res.label) == -1 && labelDataToAdd.indexOf(res.label) == -1) {
                            buffer += `(${labelObject[res.label]}, "${escQuotes(res.label)}"),`
                            labelDataToAdd += ',\n"' + res.label + '":' + nextIndex.toString()
                        }
                    } else {
                        buffer = buffer.substring(0, buffer.length - 1) + '\n;\n\n'
                    }
                    break;

                case 'artists':
                    if (i < (spotObj.length - 1)) {
                        if (Array.isArray(res.artist_id)) {
                            res.artist_id.forEach((artist_id, i) => {
                                if (!exists(buffer, artist_id)) {
                                    k++
                                    chris_artist_id[artist_id] = k
                                    buffer += `(${k}, "${artist_id}", "${escQuotes(res.artist_name[i])}"),`
                                }
                            })
                        } else {
                            if (!exists(buffer, res.artist_id)) {
                                k++
                                chris_artist_id[res.artist_id] = k
                                buffer += `(${k}, "${res.artist_id}", "${escQuotes(res.artist_name)}"),`
                            }
                        }
                    } else {
                        buffer = buffer.substring(0, buffer.length - 1) + '\n;\n\n'
                    };
                    break;

                case 'albums':
                    if (i < (spotObj.length - 1)) {
                        if (!exists(buffer, res.album_id)) {
                            k++
                            chris_album_id[res.album_id] = 100000 + k
                            buffer += `(${100000+k}, "${res.album_id}", "${escQuotes(res.album_title)}", "${res.release_date}", ${parseInt(res.upc)}, "${labelObject[res.label]}"),`
                        }
                    } else {
                        buffer = buffer.substring(0, buffer.length - 1) + '\n;\n\n'
                    };
                    break;
                case 'tracks':
                    if (i < (spotObj.length - 1)) {
                        if (!exists(buffer, res.track_id)) {
                            k++
                            chris_track_id[res.track_id] = 333333 + k
                            buffer += `(${333333+k}, "${res.track_id}", "${escQuotes(res.track_name)}"),`
                        }
                    } else {
                        buffer = buffer.substring(0, buffer.length - 1) + '\n;\n\n';
                    }
                    break;
                case 'album_tracks':
                    if (i < (spotObj.length - 1)) {
                        k++
                        buffer += `(${k}, ${chris_album_id[res.album_id]}, ${chris_track_id[res.track_id]}, ${1}),`
                    } else {
                        buffer = buffer.substring(0, buffer.length - 1) + '\n;\n\n';
                    }
                    break;
                case 'artists_tracks':
                    if (i < (spotObj.length - 1)) {
                        if (Array.isArray(res.artist_id)) {
                            res.artist_id.forEach((id) => {
                                k++
                                buffer += `(${k}, ${chris_artist_id[id]}, ${chris_track_id[res.track_id]}),`
                            })
                        } else {
                            k++
                            buffer += `(${k}, ${chris_artist_id[res.artists_id]}, ${chris_track_id[res.track_id]}),`
                        }
                    } else {
                        buffer = buffer.substring(0, buffer.length - 1) + '\n;\n\n';
                    }
                    break;
            }
            nextIndex = null
        })
    })

}).then(() => {
    return fs.writeFile(`${process.argv[3]}/${process.argv[2]}.sql`, buffer, function (err) {
        if (err) throw err;
        console.log(`Saved data as '${process.argv[3]}/${process.argv[2]}.sql'`)
    })

}).catch((e) => {
    return errorRespond(e)
})
