import React from 'react';
import { render } from 'react-dom';

// import './ReactotronConfig';

import Setup from './components/Setup';

import './assets/css/App.sass';
import './assets/css/ion/css/ionicons.min.css';

import App from './components/App';
import NotRunning from './components/NotRunning';

var ps = require('ps-node');
var running = false;

// A simple pid lookup 
function isRunning(cb) {
    cb(true);
    /*ps.lookup({
        command: 'ts3',
    }, function(err, resultList ) {
    if (err) {
        throw new Error( err );
    }

    resultList.forEach(function( process ){
            if( process ){
                running = process.pid != null;
            }
        });
        
    });*/
}

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

function checkToken() {
    console.log('ct')
    if(localStorage.getItem('ts3token') != undefined) {
        isRunning((r)=>{
            console.log(r)
            if(r) {
                render( <App />, document.getElementById('root') );
            } else {
                render( <NotRunning checkToken={checkToken} checkRunning={isRunning} />, document.getElementById('root') );
            }
        })
    } else {
        render( <Setup checkToken={checkToken} />, document.getElementById('root') );
    }
}

// Now we can render our application into it
checkToken();