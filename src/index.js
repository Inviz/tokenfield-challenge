import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Tokenfield from './Tokenfield';
import * as serviceWorker from './serviceWorker';

import colorsArray from './colors_array.json'
import colorsObject from './colors_object.json'


var onChange = function(values, input) {
	setTimeout(() => {
		this.refs.wrapper.classList.add('changed')
		serialize()
	}, 50)
	setTimeout(() => {
		this.refs.wrapper.classList.remove('changed')
	}, 300)
}
var serialize = function() {
	var inputs = document.querySelectorAll('input[type="hidden"]');
	var values = 'Form data:'
	for (var i = 0; i < inputs.length; i++) {
		if (values)
			values += '\n'
		values += inputs[i].getAttribute('name') + '=' + encodeURIComponent(inputs[i].getAttribute('value'))
	}
	document.getElementById('output').innerHTML = values;
}
ReactDOM.render(<App>
	<p>Will not allow values that are not in the list:</p>
	<Tokenfield name="select1[]" placeholder="Select multiple from a list..."  multiple options={colorsArray} onChange={onChange}/>
	<Tokenfield name="select2" placeholder="Select one from a list..." options={colorsArray} onChange={onChange}/>
	<p>Will allow new values that are not in the list:</p>
	<Tokenfield name="select3[]" placeholder="Type or select multiple from a list..."  multiple options={colorsObject} allowNew onChange={onChange}/>
	<Tokenfield name="select4" placeholder="Type or select one from a list..." options={colorsObject} allowNew onChange={onChange}/>
	<p>Does not have a list:</p>
	<Tokenfield name="select5[]" placeholder="Type multiple..."  multiple allowNew onChange={onChange}/>
	<Tokenfield name="select6" placeholder="Type one..." allowNew onChange={onChange} />
	<p>Preset values:</p>
	<Tokenfield name="select7[]" placeholder="Type multiple..." values={["Red", "Blue"]}  multiple allowNew onChange={onChange}/>
	<Tokenfield name="select8" placeholder="Type one..." value="Red" allowNew onChange={onChange} />
	<pre id="output"></pre>
</App>, document.getElementById('root'));

serialize()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
