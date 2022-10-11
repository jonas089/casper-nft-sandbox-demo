import React from 'react';
import LoadingScreen from '../components/Loading.jsx';
import {getHistory} from '../casper/controller.js';
import HistoryComponent from '../components/History.jsx';
function History() {
    const [history, setHistory] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    if (isLoading == true){
        getHistory().then(res => {
            setHistory(res.reverse());
            setIsLoading(false);
        });
    }
    if (isLoading == true){
        return (
            <LoadingScreen />
        )
    }
    else{
        return (
            <HistoryComponent history={history}/>
        );
    }
}

export default History;
