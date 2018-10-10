console.log("This is loaded");

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET,
}

exports.bands = {
    key: process.env.bands,
}

exports.omdb = {
    key: process.env.omdb,
}