import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
// import DeleteSongModal from './DeleteSongModal.js'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleDragStart(event) {
        event.dataTransfer.setData("song", event.target.id);
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = parseInt(targetId.substring('song-'.length, targetId.length - 5));
        let sourceId = event.dataTransfer.getData("song");
        sourceId = parseInt(sourceId.substring('song-'.length, sourceId.length - 5));
        setDraggedTo(false);

        store.addMoveSongTransaction(sourceId, targetId);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleClick(event) {
        if(event.detail === 2) {
            event.stopPropagation();
            let targetId = event.target.id;
            let songIndex = parseInt(targetId.substring('song-'.length, targetId.length - 5));
            store.markSongForEdit(songIndex);
        }
    }

    function handleDeleteSong(event) {
        event.stopPropagation();
        store.markSongForDelete(index);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleDeleteSong}
                value={"\u2715"}
            />
            {/* <DeleteSongModal /> */}
        </div>
    );
}

export default SongCard;