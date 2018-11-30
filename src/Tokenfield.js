import React, { Component } from 'react';
import './Tokenfield.css';

// Tokenfield, an input with ability to type.
// Optionally can have multiple values
// Optionally can provide list of suggestions
// Optionally can force only values from a list
class Tokenfield extends Component {
  constructor(props) {
    super(props)
    var values = [].concat(this.props.values || [])
                   .concat(this.props.value || [])
    var options = this.getOptions(this.props.options);
    this.state = {
      focused: false,  // check if input is focused, or force focus
      values: values,  // list of selected values
      options: options,// list of options
      suggestions: [], // filtered list of suggestions
      selected: null   // currently selected suggestion
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

    var suggestions = this.state.options 
      .filter ((option) => 
        option.name.toLowerCase().indexOf(value) === 0
        && this.state.values.indexOf(option.value) === -1) 

    this.setState({
      suggestions: suggestions,
      selected: this.props.allowNew ? null : 0
    })
  }

  // Find option name by value
  getOptionName(option) {
    if (this.state.options) {
      for (var i = 0; i < this.state.options.length; i++)
        if (this.state.options[i].value === option)
          return this.state.options[i].name
    }
  }

  // normalize options in different formats:
  //   {value: "Label", ...}
  //   ["value", ...]
  //   [["value", "label"], ...]
  //   [{"name": "label", value: "value"]}, ...]
  getOptions() {
    var options = [];
    if (this.props.options) {
      if (Array.isArray(this.props.options)) {
        this.props.options.forEach(function(option) {
          if (Array.isArray(option))
            options.push({value: option[0], name: option[1]})
          else
            options.push({value: option, name: option})
        })
      } else {
        for (var property in this.props.options) {
          if (typeof this.props.options[property] == 'object') {
            options.push(this.props.options[property])
          } else {
            options.push({name: this.props.options[property], value: property})
          }
        }
      }
    }
    if (options.length)
      return options;
  }

  // add values that are entered into a textfield
  pickValue(string) {
    debugger
    this.splitValue(string)
      .forEach((value) => 
        this.addValue(value))
    this.setState({
      selected: null,
      suggestions: []
    })
    this.refs.input.value = '';
  }

  // process commas in case comma separated string was pasted into a field
  splitValue(value) {
    return value.trim().replace(/\s\s*/, ' ').split(/\s*;,\s*/)
  }

  // add single value to the list
  addValue(value) {
    if (value && this.state.values.indexOf(value) === -1) {
      this.setValue(this.state.values.concat(value))
    }
  }

  // remove all selected values
  clearValues() {
    this.setValue([])
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

  focus() {
    this.setState({focused: true})
  }


  blur() {
    this.setState({focused: false})
    this.refs.input.blur()
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

  setValue(values) {
    this.setState({values: values})
    if (this.props.onChange)
      this.props.onChange.call(this, values, this)
    if (!this.isMultiple() && values.length)
      this.blur()
  }

  // show list of suggestions on focus, 
  // but only if custom values arent allowed
  onFocus() {
    if (this.state.options && !this.props.allowNew)
      this.openSuggestions("")
    this.focus()
  }

  // hide list of suggestions
  onBlur() {
    this.closeSuggestions()
    this.blur()
  }

  // Handle clear button press
  onClear(e) {
    this.clearValues();
    this.focus()
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
    if (this.isMultiple() || !this.state.values.length)
      this.focus()
    e.preventDefault()
  }

  // pick hovered suggestion on mouse click
  onSuggestionMouseDown(e) {
    this.pickValue(e.target.getAttribute('data-value'));
    e.preventDefault()
    e.stopPropagation()
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
                    ? this.state.suggestions[this.state.selected].value 
                    : this.props.allowNew 
                      ? e.target.value 
                      : null
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
      else if (this.state.options)
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
        this.setValue(values);
        e.preventDefault()
      }
    }
  }

  // update suggestions on input
  onInput(e) {
    if (this.state.options)
      this.openSuggestions(e.target.value)
  }

  // handle removal of a single value
  onRemoveValue(e) {
    this.removeValue(e.target.parentNode.getAttribute('data-value'));
    this.focus()
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
    var items = this.state.values.map((value) => {
      var name = this.getOptionName(value);
      if (name === undefined)
        name = value;
      return <li key={"value-" + value} 
           data-value={value} 
           data-name={name}>
        <button className="remove" 
                tabIndex="-1"
                onMouseDown={this.onRemoveValue.bind(this)}>
          Delete
        </button>
        <input type="hidden" name={this.props.name} value={value} />
        {name}
      </li>
    });
    // render suggestions
    var suggestions = this.state.suggestions.map((option, index) =>
      <li key={"suggestion-" + option.value} 
          className={this.state.selected === index ? 'selected' : null}
          data-value={option.value}
          data-name={option.name}
          data-index={index}>{option.name}
      </li>
    );
    return (
      <div className={this.getClassName()}
           ref="wrapper"
           data-multiple={this.isMultiple() || undefined} 
           onMouseDown={this.onMouseDown.bind(this)}>
        <div className="buttons">
          {this.state.values.length ? <button tabIndex="-1" className="clear" onMouseDown={this.onClear.bind(this)}>Clear</button> : null}
          {this.state.options ? <button tabIndex="-1" className="expand" onMouseDown={this.onExpand.bind(this)}>Expand</button> : null}
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
          placeholder={this.state.placeholder} />
      </div>
    );
  }
}

export default Tokenfield;
