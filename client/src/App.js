import './App.css';
import { useContext } from 'react'
import { React } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Banner, ListSelector, PlaylistCards, Statusbar } from './components'
import { GlobalStoreContext } from './store'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/

function App() {
    const { store } = useContext(GlobalStoreContext);
    function handleKeyDown(event) {
        if(event.ctrlKey) {
            if(event.keyCode === 90) {
                // console.log("90");
                if(store.hasTransactionToUndo()) {
                    store.undo();
                }
                event.preventDefault();
            } else if(event.keyCode === 89) {
                // console.log("89")
                if(store.hasTransactionToRedo()) {
                    store.redo();
                }
            }
        }

    }
    
    return (
        <div>
            <Router>
                <div onKeyDown={handleKeyDown} tabIndex="0">
                   <Banner />
                    <Switch>
                        <Route path="/" exact component={ListSelector} />
                        <Route path="/playlist/:id" exact component={PlaylistCards} />
                    </Switch> 
                </div>
            </Router>
            <Statusbar />
        </div>
        
    )
}

export default App