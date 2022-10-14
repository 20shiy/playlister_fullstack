import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * 
 * @author 
 * @author ?
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initSongIndex, initOldSong, initNewSong) {
        super();
        this.store = initStore;
        this.songIndex = initSongIndex;
        this.oldSong = initOldSong;
        this.newSong = initNewSong;
    }

    doTransaction() {
        this.store.editSongConfirm(this.songIndex, this.newSong);
    }
    
    undoTransaction() {
        this.store.editSongConfirm(this.songIndex, this.oldSong);
    }
}