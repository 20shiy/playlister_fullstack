import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import AddSong_Transaction from '../transactions/AddSong_Transaction'

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_DELETE_SONG_ACTIVE: "SET_DELETE_SONG_ACTIVE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listMarkedForDeletion: null,
        songIndexForEdit: -1,
        songIndexForRemove: -1
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: -1
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: -1
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: -1
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: -1
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    // currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: payload,
                    songIndexForEdit: -1,
                    songIndexForRemove: -1
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: store.songIndexForRemove
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: -1
                });
            }

            case GlobalStoreActionType.SET_DELETE_SONG_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: payload
                });
            }

            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            // console.log(response);
            if (response.data.success) {
                let playlist = response.data.playlist;
                // console.log(playlist);
                playlist.name = newName;
                // console.log("new name: " + playlist.name);
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.markListForDeletion = function (id) {
        async function asyncMarkListForDeletion(id) {
            let response = await api.getPlaylistById(id);
            if(response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: playlist
                })
            }
        }
        asyncMarkListForDeletion(id);
        store.showDeleteListModal();
    }

    store.deleteListById = function() {
        store.deleteListActual(store.listMarkedForDeletion._id);
        // console.log("id to be deleted: " + store.listMarkedForDeletion._id);
        store.hideDeleteListModal();
    }

    store.deleteListActual = function(id) {
        async function asyncDeleteListActual(id) {
            let response = await api.deleteListById(id);
            // console.log(response);
            if(response.data.success) {
                store.loadIdNamePairs();
                store.history.push("/");
            }
        }
        asyncDeleteListActual(id);
    }

    store.showDeleteListModal = function() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }

    store.hideDeleteListModal = function() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    store.showEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }

    store.hideEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }

    store.hideDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }

    store.showDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        // console.log("index: " + store.songIndexForRemove);
        // console.log(store.songIndexForRemove);
        modal.classList.add("is-visible");
    }

    store.createNewList = function () {
        async function asyncCreateNewList() {
            let newName = "Untitled";
            let newSongs = []
            let payload = {name: newName, songs: newSongs}

            let response = await api.createNewList(payload);
            if(response.data.success) {
                let newList = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: newList
                })
                store.history.push("/playlist/" + newList._id);
            }
        }
        asyncCreateNewList();
    }

    store.addSong = function(index, song) {
        if(store.currentList) {
            let list = store.currentList;
            let songss = list.songs;
            songss.splice(index, 0, song);
            store.currentList.songs = songss;
        }

        store.updateCurrentList();
    }

    store.addSongTransaction = function(index, song) {
        let transaction = new AddSong_Transaction(this, index, song);
        tps.addTransaction(transaction);
    }

    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if(response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }

    store.moveSong = function(oldIndex, newIndex) {
        if(oldIndex < newIndex) {
            let temp = store.currentList.songs[oldIndex];
            for(let i=oldIndex; i<newIndex; i++) {
                store.currentList.songs[i] = store.currentList.songs[i+1];
            }
            store.currentList.songs[newIndex] = temp;
        } else if(oldIndex > newIndex) {
            let temp = store.currentList.songs[oldIndex];
            for(let i=oldIndex; i>newIndex; i--) {
                store.currentList.songs[i] = store.currentList.songs[i-1];
            }
            store.currentList.songs[newIndex] = temp;
        }

        store.updateCurrentList();
    }

    store.addMoveSongTransaction = function(oldIndex, newIndex) {
        let transaction = new MoveSong_Transaction(store, oldIndex, newIndex);
        tps.addTransaction(transaction);
    }

    store.markSongForEdit = function(songIndex) {
        // let id = store.currentList._id;
        store.songIndexForEdit = songIndex;
        let song = store.currentList.songs[songIndex];
        let curTitle = song.title;
        let curArtist = song.artist;
        let curYoutubeId = song.youTubeId;

        document.getElementById("songTitle").value = curTitle;
        document.getElementById("songArtist").value = curArtist;
        document.getElementById("youtubeId").value = curYoutubeId;
        
        store.showEditSongModal();
    }

    store.editSongConfirm = function() {
        let newTitle = document.getElementById("songTitle").value;
        let newArtist = document.getElementById("songArtist").value;
        let newyoutubeId = document.getElementById("youtubeId").value;
        let newSong = {"title":newTitle, "artist":newArtist, "youTubeId":newyoutubeId};
        // console.log(newSong);
        store.currentList.songs[store.songIndexForEdit] = newSong;
        // console.log(store.currentList.songs[store.songIndexForEdit]);
        // console.log(store.currentList.songs);
        store.updateCurrentList();
        store.hideEditSongModal();
    }

    store.markSongForDelete = function(songIndex) {
        store.songIndexForRemove = songIndex;
        // console.log("index to be removed: " + store.songIndexForRemove);
        // store.setIsDeleteSongActive();
        // console.log(store.rememberRemoveIndex() + " index return by function");
        storeReducer({
            type: GlobalStoreActionType.SET_DELETE_SONG_ACTIVE,
            payload: songIndex
        });

        // console.log("after payload: " + store.songIndexForRemove);
        store.showDeleteSongModal();
    }

    store.deleteSongConfirm = function() {
        let index = store.songIndexForRemove;
        let songTobeDeleted = store.currentList.songs[index];
        store.deleteSongActual(index, songTobeDeleted);
        store.hideDeleteSongModal()
    }

    store.deleteSongActual = function(index, songTobeDeleted) {
        store.currentList.songs.splice(index, 1);
        store.updateCurrentList();
    }


    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}