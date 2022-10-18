import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserPage from './components/UserPage';
import { Router as BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import {createBrowserHistory} from 'history';
import LogInPage from './components/LogInPage';

const history =  createBrowserHistory();
//const sessionData=sessionStorage.getItem();
//const random={hash:"1234567890"}
/*
        <Route path="/users" component={Users} />
        <Route path="/contact" component={Contact} />

*/
const routing = (
    <BrowserRouter history={history}>
        <div>
            <Switch>
                <Route path="/" component={App}/>
                <Route path="/login" component={LogInPage}/>
                <Route path="/user" component={UserPage} />

            </Switch>
        </div>
    </BrowserRouter>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
