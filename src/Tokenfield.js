import React, { Component } from 'react';
import './Tokenfield.css';

// Tokenfield, an input with ability to type.
// Optionally can have multiple values
// Optionally can provide list of suggestions
// Optionally can force only values from a list
class Tokenfield extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: false,            // check if input is focused, or force focus
      values: this.props.values, // list of selected values
      suggestions: [],           // filtered list of suggestions
      selected: null             // currently selected suggestion
    }
  }
  static defaultProps = {
    values: []
  }

  // show list of suggestions for given string
  // if tokenfield does not allow custom values, 
  // it will force first matching option to be selected
  openSuggestions(string) {
    var value = this.splitValue(string).pop();

    var suggestions = this.props.list 
      .filter ((item) => 
        item.toLowerCase().indexOf(value) === 0
        && this.state.values.indexOf(item) === -1) 

    this.setState({
      suggestions: suggestions,
      selected: this.props.allowNew ? null : 0
    })
  }

  // add values that are entered into a textfield
  pickValue(string) {
    this.splitValue(string)
      .forEach((value) => 
        this.addValue(value))
    this.setState({
      selected: null,
      suggestions: []
    })
    this.refs.input.value = '';
    if (!this.isMultiple())
      this.refs.input.blur()
  }

  // process commas in case comma separated string was pasted into a field
  splitValue(value) {
    return value.trim().replace(/\s\s*/, ' ').split(/\s*;,\s*/)
  }

  // add single value to the list
  addValue(value) {
    if (value && this.state.values.indexOf(value) === -1) {
      this.setState({
        values: this.state.values.concat(value)
      })
    }
  }

  // remove all selected values
  clearValues() {
    this.setState({
      values: []
    })
  }

  // remove a single value
  removeValue(value) {
    var index = this.state.values.indexOf(value);
    if (index > -1) {
      var list = this.state.values.slice();
      list.splice(index, 1)
      this.setState({
        values: list
      })
    }
  }

  selectSuggestion(index) {
    this.setState({selected: index})
  }

  closeSuggestions(index) {
    this.setState({selected: null, suggestions: []})
  }

  // yield list of classes
  getClassName() {
    var name = "Tokenfield";
    if (this.state.focused)
      name += ' focused'
    if (this.state.values.length)
      name += ' filled'
    return name
  }

  // check if multiple values are allowed
  isMultiple() {
    return this.props.hasOwnProperty('multiple') && this.props.multiple !== false
  }

  // show list of suggestions on focus, 
  // but only if custom values arent allowed
  onFocus() {
    if (this.props.list && !this.props.allowNew)
      this.openSuggestions("")
    this.setState({focused: true})
  }

  // hide list of suggestions
  onBlur() {
    this.closeSuggestions()
    this.setState({focused: false})
  }

  // Handle clear button press
  onClear(e) {
    this.clearValues();
    this.setState({focused: true})
    e.preventDefault();
  }

  // toggle suggestion list
  onExpand(e) {
    if (this.state.suggestions.length)
      this.closeSuggestions()
    else
      this.openSuggestions("")
    e.preventDefault();
  }

  // focus input on click
  onMouseDown(e) {
    this.setState({focused: true})
    e.preventDefault()
  }

  // pick hovered suggestion on mouse click
  onSuggestionMouseDown(e) {
    this.pickValue(e.target.getAttribute('data-value'));
    e.preventDefault()
  }

  // hover suggestion
  onSuggestionHover(e) {
    var index = e.target.getAttribute('data-index');
    if (index != null && !isNaN(parseInt(index)))
      this.selectSuggestion(parseInt(index))
  }

  onKeyDown(e) {  
    // add values
    if (e.keyCode === 13  //enter
      || e.keyCode === 188 //,
      || e.keyCode === 186 //;
    ) {
      var chosen = this.state.selected != null
                    ? this.state.suggestions[this.state.selected] 
                    : this.props.allowNew 
                      ? e.target.value 
                      : null

                  console.log(chosen, this.props)
      if (chosen != null)
        this.pickValue(chosen)
      e.preventDefault()
    // scroll suggestions
    } else if (e.keyCode === 38) {//up 
      if (this.state.suggestions.length) 
        this.selectSuggestion(
          this.state.selected === null 
            ? this.state.suggestions.length - 1 
            : (this.state.selected || this.state.suggestions.length) - 1
        )
      e.preventDefault()
    } else if (e.keyCode === 40) { //down
      if (this.state.suggestions.length)
        this.selectSuggestion(
          this.state.selected === null 
            ? 0
            : (this.state.selected + 1) % this.state.suggestions.length
        )
      else if (this.props.list.length)
        this.openSuggestions("")
      e.preventDefault()
    // close suggestions
    } else if (e.keyCode === 27) { //esc
      this.closeSuggestions()
      e.preventDefault()
    // pop last value
    } else if (e.keyCode == 8) { // backspace
      if (this.refs.input.value.length == 0) {
        var values = this.state.values.slice()
        values.pop()
        this.setState({values: values})
        e.preventDefault()
      }
    }
  }

  // update suggestions on input
  onInput(e) {
    if (this.props.list)
      this.openSuggestions(e.target.value)
  }

  // handle removal of a single value
  onRemoveValue(e) {
    this.removeValue(e.target.parentNode.getAttribute('data-value'));
    this.setState({focused: true})
  }

  // refocus input 
  componentDidUpdate () {
    // YF: setTimeout isn't good for this, 
    // but i couldnt quickly figure out at which point 
    // i use it to refocus input after deleting previous value
    if (this.state.focused) {
      setTimeout(() => {
        this.refs.input.focus();
      }, 10)
    }
  }

  render() {
    // render values
    var items = this.state.values.map((value) =>
      <li key={"value-" + value} data-value={value}>
        <button className="remove" 
                tabIndex="-1"
                onMouseDown={this.onRemoveValue.bind(this)}>
          Delete
        </button>
        {value}
      </li>
    );
    // render suggestions
    var suggestions = this.state.suggestions.map((value, index) =>
      <li key={"suggestion-" + value} 
          className={this.state.selected === index ? 'selected' : null}
          data-value={value}
          data-index={index}>{value}
      </li>
    );
    return (
      <div className={this.getClassName()} 
           data-multiple={this.isMultiple() || undefined} 
           onMouseDown={this.onMouseDown.bind(this)}>
        <div className="buttons">
          {this.state.values.length ? <button tabIndex="-1" className="clear" onMouseDown={this.onClear.bind(this)}>Clear</button> : null}
          {this.props.list ? <button tabIndex="-1" className="expand" onMouseDown={this.onExpand.bind(this)}>Expand</button> : null}
        </div>
        <ul className="suggestions"
          onMouseDown={this.onSuggestionMouseDown.bind(this)}
          onMouseMove={this.onSuggestionHover.bind(this)}>
          {suggestions}
        </ul>
        <ul className="values">
          {items}
        </ul>
        <input ref="input"  type="text" 
          onKeyDown={this.onKeyDown.bind(this)} 
          onInput={this.onInput.bind(this)} 
          onFocus={this.onFocus.bind(this)} 
          onBlur={this.onBlur.bind(this)} 
          placeholder={this.props.placeholder} />
      </div>
    );
  }
}

export default Tokenfield;
