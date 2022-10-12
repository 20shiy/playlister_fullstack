import {useContext} from 'react'
import {GlobalStoreContext} from '../store'

function EditSongModal() {
    const {store} = useContext(GlobalStoreContext);

    function handleEditSong() {
        store.editSongConfirm();
    }

    function handlehideEditSongModal() {
        store.hideEditSongModal();
    }

    return (
        <div className="modal" id="edit-song-modal" data-animation="slideInOutLeft">
            <div className="edit-modal-root" id='edit-song-root'>
                <div className="modal-north">
                    Edit Song
                </div>
                <div className='modal-center'>
                    <div className="modal-center-content">
                        <form id="frm">
                            <div className="frm-component">
                                <label htmlFor="songTitle">Title:</label><br/>
                                <label htmlFor="songArtist">Artist:</label><br/>
                                <label htmlFor="youtubeId">Youtube ID:</label>
                            </div>
                            <div>
                                <input className="frm-component"type="text" id="songTitle" name="songTitle"/><br/>
                                <input className="frm-component"type="text" id="songArtist" name="songArtist"/><br/>
                                <input className="frm-component"type="text" id="youtubeId" name="youtubeId"/>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="modal-south">
                    <input 
                        type="button" 
                        id="edit-song-confirm-button" 
                        className="modal-button" 
                        onClick={handleEditSong}
                        value='Confirm' />

                    <input 
                        type="button" 
                        id="edit-song-cancel-button" 
                        className="modal-button" 
                        onClick={handlehideEditSongModal}
                        value='Cancel' />
                </div>
            </div>
        </div>
    )
}

export default EditSongModal;