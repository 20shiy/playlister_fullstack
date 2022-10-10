import {useContext} from 'react'
import {GlobalStoreContext} from '../store'

function DeleteListModal() {
    const {store} = useContext(GlobalStoreContext);
    let name = "";
    if(store.listMarkedForDeletion) {
        // console.log("store has currentList? ");
        name = store.listMarkedForDeletion.name;
    }

    function handleDeleteList() {
        store.deleteListById();
    }

    function handleHideDeleteListModal() {
        store.hideDeleteListModal();
    }

    return (
        <div 
            className="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
            <div className="modal-root" id='verify-delete-list-root'>
                <div className="modal-north">
                    Delete playlist?
                </div>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently delete the <b>{name}</b> playlist?
                    </div>
                </div>
                <div className="modal-south">
                    <input type="button" 
                        id="delete-list-confirm-button" 
                        className="modal-button" 
                        onClick={handleDeleteList}
                        value='Confirm' />
                    <input type="button" 
                        id="delete-list-cancel-button" 
                        className="modal-button" 
                        onClick={handleHideDeleteListModal}
                        value='Cancel' />
                </div>
            </div>
        </div>
    )
}

export default DeleteListModal;