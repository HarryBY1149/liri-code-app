require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var spotify = new Spotify(keys.spotify)
var bands = keys.bands.key;
var omdb = keys.omdb.key;
var input = process.argv;
var command = input[2];
var query = "";


if (input.length == 4) {
    query = input[3];
} else {
    var queryArr = [];
    for (var i = 3; i < input.length; i++) {
        queryArr.push(input[i]);
    };
    query = queryArr.join("%20");
}

switch (command) {
    case "concert-this":
        concert_this(query);
        fs.appendFile("log.txt", "concert-this: " + query, function(err){})
        break;
    case "spotify-this-song":
        spotify_this(query);
        fs.appendFile("log.txt", "spotify-this-song: " + query, function(err){})
        break;
    case "movie-this":
        movie_this(query);
        fs.appendFile("log.txt", "movie-this:" + query, function(err){})
        break;
    case "do-what-it-says":
        it_says();
        fs.appendFile("log.txt", "do-what-it-says", function(err){})
        break;
};

function concert_this(query) {
    var bandsUrl = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=" + bands;
    request(bandsUrl, function (err, response, body) {
        if (err) {
            console.log(err)
        } else {
            var data = JSON.parse(body);
            for (var i = 0; i < data.length; i++) {
                console.log("")
                console.log(data[i].venue.name);
                console.log(data[i].venue.city + ", " + data[i].venue.region + ". " + data[i].venue.country)
                var rawDate = data[i].datetime.split("T");
                var date = moment(rawDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                console.log(date);
                console.log("*******************")
                fs.appendFile("log.txt", " "+"\r\n", function(err){})
                fs.appendFile("log.txt", data[i].venue.name+"\r\n", function(err){})
                fs.appendFile("log.txt", data[i].venue.city + ", " + data[i].venue.region + ". " + data[i].venue.country+"\r\n", function(err){})
                fs.appendFile("log.txt", date+"\r\n", function(err){})
                fs.appendFile("log.txt", "*******************"+"\r\n", function(err){})

            };
        };
    });
}

function spotify_this(query) {
    if (query.length <= 1) {
        var spotifyQuery = "The Sign Ace of Base";
    } else {
        spotifyQuery = query
    }
    spotify.search({ type: "track", query: spotifyQuery, limit: "10" }, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log("");
            fs.appendFile("log.txt", " "+"\r\n", function(err){})
            console.log(data.tracks.items[0].artists[0].name)
            fs.appendFile("log.txt", data.tracks.items[0].artists[0].name+"\r\n", function(err){})
            console.log(data.tracks.items[0].name)
            fs.appendFile("log.txt", data.tracks.items[0].name+"\r\n", function(err){})
            if (data.tracks.items[0].preview_url != null) {
                console.log(data.tracks.items[0].preview_url)
                fs.appendFile("log.txt", data.tracks.items[0].preview_url+"\r\n", function(err){})
            } else {
                console.log("No preview available")
                fs.appendFile("log.txt", "No preview available"+"\r\n", function(err){})
            };
            console.log(data.tracks.items[0].album.name);
            fs.appendFile("log.txt", data.tracks.items[0].album.name+"\r\n", function(err){})
            console.log("******************")
            fs.appendFile("log.txt", "******************"+"\r\n", function(err){})
        }
    });
};

function movie_this(query) {
    if (query.length <= 1) {
        var movieQuery = "Mr.Nobody";
    } else {
        movieQuery = query;
    }
    var movieUrl = "http://www.omdbapi.com/?apikey=" + omdb + "&t=" + movieQuery;
    request(movieUrl, function (err, response, body) {
        if (err) {
            console.log(err)
        } else {
            var data = JSON.parse(body);
            console.log("");
            fs.appendFile("log.txt", ""+"\r\n", function(err){})
            console.log("Title: "+data.Title);
            fs.appendFile("log.txt", "Title: "+data.Title+"\r\n", function(err){})
            console.log("Year: "+data.Year);
            fs.appendFile("log.txt", "Year: "+data.Year+"\r\n", function(err){})
            console.log("IMDB: " + data.imdbRating);
            fs.appendFile("log.txt", "IMDB: " + data.imdbRating+"\r\n", function(err){})
            console.log(data.Ratings[1].Source + ": " + data.Ratings[1].Value);
            fs.appendFile("log.txt", data.Ratings[1].Source + ": " + data.Ratings[1].Value+"\r\n", function(err){})
            console.log("Country Produced: "+data.Country);
            fs.appendFile("log.txt", "Country Produced: "+data.Country+"\r\n", function(err){})
            console.log("Languages: "+data.Language);
            fs.appendFile("log.txt", "Languages: "+data.Language+"\r\n", function(err){})
            console.log("Plot Summary: "+data.Plot);
            fs.appendFile("log.txt", "Plot Summary: "+data.Plot+"\r\n", function(err){})
            console.log("Featuring: "+data.Actors);
            fs.appendFile("log.txt", "Featuring: "+data.Actors+"\r\n", function(err){})
        };
    });
};
function it_says() {
    fs.readFile("random.txt", 'utf-8', function (err, data) {
        if (err) {
            console.log(err)
        } else {
            var commandArr = data.split(",");
            var movieQuery = commandArr[3];
            movie_this(movieQuery);
            var songQuery = commandArr[1];
            spotify_this(songQuery);
        }
    })
}




