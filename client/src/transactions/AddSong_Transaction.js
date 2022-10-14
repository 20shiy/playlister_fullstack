import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initSongIndex, initNewSong) {
        super();
        this.store = initStore;
        this.songIndex = initSongIndex;
        this.song = initNewSong;
    }

    doTransaction() {
        this.store.addSong(this.songIndex, this.song);
    }
    
    undoTransaction() {
        this.store.deleteSongActual(this.songIndex, this.song);
    }
}