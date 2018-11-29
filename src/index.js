import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Tokenfield from './Tokenfield';
import * as serviceWorker from './serviceWorker';

import colors from './colors.json'


ReactDOM.render(<App>
	<p>Will not allow that are not in the list:</p>
	<Tokenfield placeholder="Select multiple from a list..."  multiple list={colors}/>
	<Tokenfield placeholder="Select one from a list..." list={colors}/>
	<p>Will allow new values that are not in the list:</p>
	<Tokenfield placeholder="Type or select multiple from a list..."  multiple list={colors} allowNew/>
	<Tokenfield placeholder="Type or select one from a list..." list={colors} allowNew/>
	<p>Does not have a list:</p>
	<Tokenfield placeholder="Type multiple..."  multiple allowNew/>
	<Tokenfield placeholder="Type one..." allowNew />
</App>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
