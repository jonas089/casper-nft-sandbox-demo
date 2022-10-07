import React from 'react';
import LoadingScreen from '../components/Loading.jsx';
import {getHistory} from '../casper/controller.js';
function History() {
    const [history, setHistory] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    if (isLoading == true){
        getHistory().then(res => {
            setHistory(res);
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
            <div className='grid place-items-center'>
                {history.map((deploy, id) => (
                <div class="px-5 py-6">
                <div class="max-w-sm rounded break-all shadow-lg px-4 bg-gray-200 py-2 ">
                    <a className='text-blue-600' href={'https://testnet.cspr.live/deploy/'+deploy}>{deploy}</a>
                </div>
              </div>
              ))}
            </div>
        );
    }
}

export default History;
