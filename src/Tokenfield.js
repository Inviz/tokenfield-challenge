import React, { Component } from 'react';
import './Tokenfield.css';

class Tokenfield extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: false,
      values: this.props.values,
      suggestions: [],
      selected: null
    }
  }
  static defaultProps = {
    values: []
  }


  suggest(string) {
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

  clearValues() {
    this.setState({
      values: []
    })
  }

  isMultiple() {
    return this.props.hasOwnProperty('multiple') && this.props.multiple !== false
  }

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


  onFocus() {
    if (this.props.list && !this.props.allowNew)
      this.suggest("")
    this.setState({focused: true})
  }

  onBlur() {
    setTimeout(() => {
      if (!this.state.focused)
        this.closeSuggestions()

    }, 50)
    this.setState({focused: false})
  }

  onClear(e) {
    this.clearValues();
    this.setState({focused: true})
    e.preventDefault();
  }

  onExpand(e) {
    if (this.state.suggestions.length)
      this.closeSuggestions()
    else
      this.suggest("")
    e.preventDefault();
  }

  onMouseDown(e) {
    this.setState({focused: true})
    e.preventDefault()
  }

  onSuggestionMouseDown(e) {
    this.pickValue(e.target.getAttribute('data-value'));
    e.preventDefault()
  }

  onSuggestionHover(e) {
    var index = e.target.getAttribute('data-index');
    if (index != null && !isNaN(parseInt(index)))
      this.selectSuggestion(parseInt(index))
  }

  onKeyDown(e) {
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
        this.suggest("")
      e.preventDefault()
    } else if (e.keyCode === 27) { //esc
      this.closeSuggestions()
    }
  }

  onInput(e) {
    if (this.props.list)
      this.suggest(e.target.value)
  }

  onRemoveValue(e) {
    this.removeValue(e.target.parentNode.getAttribute('data-value'));
    this.setState({focused: true})
  }

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
