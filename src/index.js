import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'

import App from './App';
import * as serviceWorker from './serviceWorker';
import Hello from './Hello'
import signUpPage from './components/SignUp'


// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

const routing = (
    <Router>
            <Switch>
                <Route exact path='/' component={App}></Route>
                <Route path='/Hello' component={Hello}></Route>
                <Route path='/signup' component={signUpPage}></Route>
                <Route component={()=><h1>404 Not Found</h1>}></Route>
            </Switch>
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'));
serviceWorker.unregister();
