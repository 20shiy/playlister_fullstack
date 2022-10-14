import {useContext} from 'react'
import {GlobalStoreContext} from '../store'

function DeleteSongModal() {
    const {store} = useContext(GlobalStoreContext);
    
    let name = '';
    let index = store.songIndexForRemove;
    if(index >= 0) {
        if(store.currentList.songs[index]) {
            name = store.currentList.songs[index].title;
        }
    }

    function handleDeleteSong() {
        store.deleteSongConfirm();
    }

    function handlehideDeleteSongModal() {
        store.hideDeleteSongModal();
    }

    return (
        
        <div className="modal" id="delete-song-modal" data-animation="slideInOutLeft">
            <div className="modal-root" id='verify-delete-list-root'>
                <div className="modal-north">
                    Remove song?
                </div>                
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently remove <i><b>{name}</b></i> from the playlist?
                    </div>
                </div>
                <div className="modal-south">
                    <input 
                        type="button" 
                        id="delete-song-confirm-button" 
                        className="modal-button" 
                        onClick={handleDeleteSong}
                        value='Confirm' />
                    <input 
                        type="button" 
                        id="delete-song-cancel-button" 
                        className="modal-button" 
                        onClick={handlehideDeleteSongModal}
                        value='Cancel' />
                </div>
            </div>
        </div>
    )
}

export default DeleteSongModal;