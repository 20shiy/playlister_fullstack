// const { deleteListById } = require('../../client/src/api');
const Playlist = require('../models/playlist-model')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    // console.log("createPlaylist body: " + body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    // console.log("playlist: " + JSON.stringify(body));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    playlist
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
}
getPlaylistById = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err})
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: 'Playlists not found'})
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id : list._id,
                    name : list.name
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}

updatePlaylist = async (req, res) => {
    // console.log("inside server controller update playlist");
    const body = req.body;
    if(!body) {
        return res.status(400).json({success: false, error: 'You must provide body to update'})
    }
    Playlist.findOne({_id:req.params.id}, (err, list) => {
        if(err) {
            return res.status.json({
                err,
                message: 'list not found'
            })
        }

        list.name = body.name
        list.songs = body.songs
        // console.log(body.songs);
        list.save().then(() => {
            console.log("updated!?")
            return res.status(200).json({success: true, 
                id: list._id,
                message: 'update playlist successful!'})
        }).catch(error => {
            console.log("not updated")
            return res.status(400).json({
                error,
                message: "list not updated"
            })
        })
    })
}

deleteListById = async (req, res) => {
    await Playlist.findOneAndDelete({_id:req.params.id}, () => {
        console.log("list deleted")
        return res.status(200).json({success: true})
    }).catch(err => {
        console.log("error when deleting list " + err)
        return res.status(200).json({success: false})
    })
}
module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylistPairs,
    getPlaylistById,
    updatePlaylist,
    deleteListById
}