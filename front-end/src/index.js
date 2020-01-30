import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Signup from './components/login/Signup';
// import Login from './components/login/Login';
import {createStore} from 'redux'
import MessageReducer from './reducer/MessageReducer'
import { Provider } from 'react-redux';

const store = createStore(MessageReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
const routing = (
    <Router>
        <switch>
            <Route exact path='/' component={App}/>
            <Route path='/signup' component={Signup}/>
            {/* <Route path='/login' component={Login}/> */}

        </switch>
    </Router>
)

ReactDOM.render(
    <Provider store={store}>
    {routing}
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
