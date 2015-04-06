document.addEventListener('DOMContentLoaded', function() {
var Highlight = window.app.Highlight;

// ======== Sample 1 ========

var EditableLabel1 = React.createClass({
  componentDidUpdate: function() {
    if (this.props.editing) {
      React.findDOMNode(this.refs.TheInput).focus();
    }
  },

  render: function() {
    if (this.props.editing) {
      return (
        <input ref="TheInput" defaultValue={this.props.text} onBlur={this._onBlur} />
      );
    } else {
      return (
        <label onDoubleClick={this.props.enterEditModeHandler}>{this.props.text}</label>
      );
    }
  },

  _onBlur: function() {
    var value = React.findDOMNode(this.refs.TheInput).value;
    this.props.saveHandler(value);
  }
});

var List1 = React.createClass({
  getInitialState: function() {
    return { rows: [
        {editing: false, text: "Double click me"},
        {editing: false, text: "Double Click me too"},
        {editing: false, text: "Double click me already"}
      ]
    };
  },
  render: function() {
    var liNodes = this.state.rows.map(function(row, index) {
      return (
        <li key={index}>
          <EditableLabel1
            editing={row.editing}
            text={row.text}
            enterEditModeHandler={this._enterEditMode.bind(null, index)}
            saveHandler={this._save.bind(null, index)}
          />
        </li>
      );
    }.bind(this));

    return (
      <ul>{liNodes}</ul>
    );
  },

  _enterEditMode: function(index) {
    var rows = this.state.rows;
    rows[index].editing = true;
    this.setState({rows: rows});
  },

  _save: function(index, value) {
    var rows = this.state.rows;
    rows[index].text = value;
    rows[index].editing = false;
    this.setState({rows: rows});
  }
});

var mountNode1 = document.getElementById("sample1");
var code1 = mountNode1.innerHTML;
React.render(<Highlight code={code1}><List1 /></Highlight>, mountNode1);

// ======== Sample 2 ========

var EditableLabel2 = React.createClass({
  getInitialState: function() {
    return {editing: false};
  },

  componentDidUpdate: function() {
    if (this.state.editing) {
      React.findDOMNode(this.refs.TheInput).focus();
    }
  },

  render: function() {
    if (this.state.editing) {
      return (
        <input ref="TheInput" defaultValue={this.props.text} onBlur={this._onBlur} />
      );
    } else {
      return (
        <label onDoubleClick={this._enterEditMode}>{this.props.text}</label>
      );
    }
  },

  _enterEditMode: function() {
    this.setState({editing: true});
  },

  _onBlur: function() {
    var value = React.findDOMNode(this.refs.TheInput).value;
    this.props.saveHandler(value);
    this.setState({editing: false});
  }
});

var List2 = React.createClass({
  getInitialState: function() {
    return { rows: [
        {text: "Double click me"},
        {text: "Double Click me too"},
        {text: "Double click me already"}
      ]
    };
  },
  render: function() {
    var liNodes = this.state.rows.map(function(row, index) {
      return (
        <li key={index}>
          <EditableLabel2
            text={row.text}
            saveHandler={this._save.bind(null, index)}
          />
        </li>
      );
    }.bind(this));

    return (
      <ul>{liNodes}</ul>
    );
  },

  _save: function(index, value) {
    var rows = this.state.rows;
    rows[index].text = value;
    this.setState({rows: rows});
  }
});

var mountNode2 = document.getElementById("sample2");
var code2 = mountNode2.innerHTML;
React.render(<Highlight code={code2}><List2 /></Highlight>, mountNode2);

});