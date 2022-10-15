import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    function handleAddSong() {
        let index = store.currentList.songs.length;
        let newSong = {"title":"Untitled", "artist":"Unknown", "youTubeId":"dQw4w9WgXcQ"};
        store.addSongTransaction(index, newSong);
    }

    let editStatus = true;
    let toggleStatus = store.toggle;
    let undoStatus = !store.canUndo;
    console.log("undo status: " + undoStatus);
    let redoStatus = !store.canRedo;
    // console.log(toggleStatus);
    if (store.currentList) {
        if(!toggleStatus) {
            editStatus = false;
        }
        if(toggleStatus) {
            undoStatus = true;
            redoStatus = true;
        }
        
    }

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus}
                value="+"
                className={enabledButtonClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={undoStatus}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={redoStatus}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={editStatus}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;