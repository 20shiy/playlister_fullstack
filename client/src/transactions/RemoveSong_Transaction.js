import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * RemoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author 
 * @author ?
 */
export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initSongIndex, initSongRemoved) {
        super();
        this.store = initStore;
        this.songIndex = initSongIndex;
        this.song = initSongRemoved;
    }

    doTransaction() {
        this.store.deleteSongActual(this.songIndex, this.song);
    }
    
    undoTransaction() {
        this.store.addSong(this.songIndex, this.song);
    }
}