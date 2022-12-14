import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import AddSong_Transaction from '../transactions/AddSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import EditSong_Transaction from '../transactions/EditSong_Transaction'

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
    SET_DELETE_SONG_ACTIVE: "SET_DELETE_SONG_ACTIVE",
    SET_EDIT_SONG_ACTIVE: "SET_EDIT_SONG_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_TOGGLE_DELETE_LIST: "SET_TOGGLE_DELETE_LIST",
    SET_TOGGLE_SONG: "SET_TOGGLE_SONG",
    SET_HAVE_TRANSACTIONS: "SET_HAVE_TRANSACTIONS"
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
        songIndexForRemove: -1,
        toggle: false,
        canUndo: false,
        canRedo: false
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
                    // currentList: payload.playlist,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: -1,
                    toggle: false,
                    canUndo: false,
                    canRedo: false
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
                    songIndexForRemove: -1,
                    toggle: false,
                    canUndo: false,
                    canRedo: false
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
                    songIndexForRemove: -1,
                    toggle: false,
                    canUndo: false,
                    canRedo: false
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
                    songIndexForRemove: -1,
                    toggle: false,
                    canUndo: false,
                    canRedo: false
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
                    songIndexForRemove: -1,
                    toggle: true,
                    canUndo: false,
                    canRedo: false
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
                    songIndexForRemove: store.songIndexForRemove,
                    toggle: false,
                    canUndo: tps.hasTransactionToUndo(),
                    canRedo: tps.hasTransactionToRedo()
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: -1,
                    toggle: false,
                    canUndo: false,
                    canRedo: false
                });
            }

            case GlobalStoreActionType.SET_DELETE_SONG_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: payload,
                    toggle: true,
                    canUndo: tps.hasTransactionToUndo(),
                    canRedo: tps.hasTransactionToRedo()
                });
            }

            case GlobalStoreActionType.SET_EDIT_SONG_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songIndexForEdit: payload,
                    songIndexForRemove: -1,
                    toggle: true,
                    canUndo: tps.hasTransactionToUndo(),
                    canRedo: tps.hasTransactionToRedo()
                });
            }

            case GlobalStoreActionType.SET_TOGGLE_DELETE_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songIndexForEdit: -1,
                    songIndexForRemove: -1,
                    toggle: false,
                    canUndo: false,
                    canRedo: false
                });
            }

            case GlobalStoreActionType.SET_TOGGLE_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    songIndexForEdit: payload,
                    songIndexForRemove: -1,
                    toggle: false,
                    canUndo: tps.hasTransactionToUndo(),
                    canRedo: tps.hasTransactionToRedo()
                });
            }

            case GlobalStoreActionType.SET_HAVE_TRANSACTIONS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    songIndexForEdit: payload,
                    songIndexForRemove: -1,
                    toggle: false,
                    canUndo: payload.canUndo,
                    canRedo: payload.canRedo
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
        // console.log("closing list");
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions()
        // console.log(store.currentList);
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
        // console.log("call set current list");
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
        // console.log("list name active funtion called");
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
        // console.log("list name active in " + store.listNameActive);
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
        storeReducer({
            type: GlobalStoreActionType.SET_TOGGLE_DELETE_LIST,
            payload: null
        });
        modal.classList.remove("is-visible");
    }

    store.showEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }

    store.hideEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        storeReducer({
            type: GlobalStoreActionType.SET_TOGGLE_SONG,
            payload: null
        });
        modal.classList.remove("is-visible");
    }

    store.hideDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.SET_TOGGLE_SONG,
            payload: null
        });
        // modal.classList.remove("is-visible");
    }

    store.showDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }

    store.createNewList = function () {
        async function asyncCreateNewList() {
            let newName = "Untitled" + store.idNamePairs.length;
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
        console.log("can undo: " + store.canUndo);
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
        storeReducer({
            type: GlobalStoreActionType.SET_EDIT_SONG_ACTIVE,
            payload: songIndex
        });
        let song = store.currentList.songs[songIndex];
        let curTitle = song.title;
        let curArtist = song.artist;
        let curYoutubeId = song.youTubeId;

        document.getElementById("songTitle").value = curTitle;
        document.getElementById("songArtist").value = curArtist;
        document.getElementById("youtubeId").value = curYoutubeId;
        
        store.showEditSongModal();
    }

    store.editSongConfirm = function(songIndex, newSong) {
        store.currentList.songs.splice(songIndex, 1, newSong);
        // store.setHaveTransaction();
        store.updateCurrentList();
        store.hideEditSongModal();
    }

    store.addEditSongTransaction = function(songIndex, newSong) {
        let oldSong = store.currentList.songs[store.songIndexForEdit];
        let transaction = new EditSong_Transaction(store, songIndex, oldSong, newSong);
        tps.addTransaction(transaction);
    }

    store.markSongForDelete = function(songIndex) {
        store.songIndexForRemove = songIndex;
        storeReducer({
            type: GlobalStoreActionType.SET_DELETE_SONG_ACTIVE,
            payload: songIndex
        });
        store.showDeleteSongModal();
    }

    store.deleteSongConfirm = function() {
        let index = store.songIndexForRemove;
        let songTobeDeleted = store.currentList.songs[index];
        store.addDeleteSongTransaction(index, songTobeDeleted);
        store.hideDeleteSongModal()
    }

    store.deleteSongActual = function(index, songTobeDeleted) {
        store.currentList.songs.splice(index, 1);
        // store.setHaveTransaction();
        store.updateCurrentList();
    }

    store.addDeleteSongTransaction = (songIndex, song) => {
        let transaction = new RemoveSong_Transaction(store, songIndex, song);
        tps.addTransaction(transaction);
    }

    store.hasTransactionToUndo = function() {
        return tps.hasTransactionToUndo();
    }

    store.hasTransactionToRedo = function() {
        return tps.hasTransactionToRedo();
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}