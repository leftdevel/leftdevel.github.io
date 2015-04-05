document.addEventListener('DOMContentLoaded', function() {
var Highlight = window.app.Highlight;

// ======== Sample 1 ========

var SimpleForm1 = React.createClass({displayName: "SimpleForm1",
  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("input", {ref: "Email", defaultValue: ""}), 
        React.createElement("button", {onClick: this._submit}, "Submit")
      )
    );
    },

  _submit: function(event) {
    event.preventDefault();
    var value = React.findDOMNode(this.refs.Email).value;
    console.log(value);
  }
});

var mountNode1 = document.getElementById("sample1");
var code1 = mountNode1.innerHTML;
React.render(React.createElement(Highlight, {code: code1}, React.createElement(SimpleForm1, null)), mountNode1);


// ======== Sample 2 ========

var SimpleForm2 = React.createClass({displayName: "SimpleForm2",
  getInitialState: function() {
    return {email: ''};
  },

  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("input", {value: this.state.email, onChange: this._onChange}), 
        React.createElement("button", {onClick: this._submit}, "Submit")
      )
    );
  },

  _onChange: function(event) {
    var value = event.target.value;
    this.setState({email: value});
  },

  _submit: function(event) {
    event.preventDefault();
    console.log(this.state.email);
  }
});

var mountNode2 = document.getElementById("sample2");
var code2 = mountNode2.innerHTML;
React.render(React.createElement(Highlight, {code: code2}, React.createElement(SimpleForm2, null)), mountNode2);

// ======== Sample 3 ========

var SimpleForm3 = React.createClass({displayName: "SimpleForm3",
  getInitialState: function() {
    return {email: ''};
  },

  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("input", {value: this.state.email, onChange: this._onChange}), 
        React.createElement("button", {onClick: this._submit}, "Submit")
      )
    );
  },

  _onChange: function(event) {
    var value = event.target.value;
    if (value.length > 5) return;
    this.setState({email: value.toUpperCase()});
  },

  _submit: function(event) {
    event.preventDefault();
    console.log(this.state.email);
  }
});

var mountNode3 = document.getElementById("sample3");
var code3 = mountNode3.innerHTML;
React.render(React.createElement(Highlight, {code: code3}, React.createElement(SimpleForm3, null)), mountNode3);

// ======== Sample 4 ========

var EditableLabel1 = React.createClass({displayName: "EditableLabel1",
  componentDidUpdate: function() {
    if (this.props.editing) {
      React.findDOMNode(this.refs.TheInput).focus();
    }
  },

  render: function() {
    if (this.props.editing) {
      return (
        React.createElement("input", {ref: "TheInput", defaultValue: this.props.text, onBlur: this._onBlur})
      );
    } else {
      return (
        React.createElement("label", {onDoubleClick: this.props.enterEditModeHandler}, this.props.text)
      );
    }
  },

  _onBlur: function() {
    var value = React.findDOMNode(this.refs.TheInput).value;
    this.props.saveHandler(value);
  }
});

var List1 = React.createClass({displayName: "List1",
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
        React.createElement("li", {key: index}, 
          React.createElement(EditableLabel1, {
            editing: row.editing, 
            text: row.text, 
            enterEditModeHandler: this._enterEditMode.bind(null, index), 
            saveHandler: this._save.bind(null, index)}
          )
        )
      );
    }.bind(this));

    return (
      React.createElement("ul", null, liNodes)
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

var mountNode4 = document.getElementById("sample4");
var code4 = mountNode4.innerHTML;
React.render(React.createElement(Highlight, {code: code4}, React.createElement(List1, null)), mountNode4);

// ======== Sample 5 ========

var EditableLabel2 = React.createClass({displayName: "EditableLabel2",
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
        React.createElement("input", {ref: "TheInput", defaultValue: this.props.text, onBlur: this._onBlur})
      );
    } else {
      return (
        React.createElement("label", {onDoubleClick: this._enterEditMode}, this.props.text)
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

var List2 = React.createClass({displayName: "List2",
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
        React.createElement("li", {key: index}, 
          React.createElement(EditableLabel2, {
            text: row.text, 
            saveHandler: this._save.bind(null, index)}
          )
        )
      );
    }.bind(this));

    return (
      React.createElement("ul", null, liNodes)
    );
  },

  _save: function(index, value) {
    var rows = this.state.rows;
    rows[index].text = value;
    this.setState({rows: rows});
  }
});

var mountNode5 = document.getElementById("sample5");
var code5 = mountNode5.innerHTML;
React.render(React.createElement(Highlight, {code: code5}, React.createElement(List2, null)), mountNode5);

// ======== Sample 6 ========

var Profile1 = React.createClass({displayName: "Profile1",
  getInitialState: function() {
    return {
      username: this.props.initialUsername,
      editing: false
    };
  },

  render: function() {
    if (this.state.editing) {
      return (
        React.createElement("form", null, 
          React.createElement("label", null, "Username"), 
          React.createElement("input", {value: this.state.username, onChange: this._onChange}), 
          React.createElement("button", {onClick: this._submit}, "Submit")
        )
      );
    } else {
      return (
        React.createElement("a", {href: "#", onClick: this._enterEditMode}, "Edit Profile")
      );
    }
  },

  _onChange: function(event) {
    var value = event.target.value;
    this.setState({username: value});
  },

  _submit: function(event) {
    event.preventDefault();
    this.props.updateHandler(this.state.username);
    this.setState({editing: false});
  },

  _enterEditMode: function(event) {
    event.preventDefault();
    this.setState({editing: true});
  }
});

var Dashboard1 = React.createClass({displayName: "Dashboard1",
  getInitialState: function() {
    return {user: {username: 'John Doe'}};
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", null, "Welcome ", React.createElement("strong", null, this.state.user.username)), 
        React.createElement(Profile1, {initialUsername: this.state.user.username, updateHandler: this._updateUsername})
      )
    );
  },

  _updateUsername: function(newUsername) {
    var state = this.state;
    state.user.username = this._ucwords(newUsername);
    this.setState(state);
  },

  // borrowed from https://gist.github.com/4541395.git
  _ucwords: function(str) {
    str = str.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
      function(s){
        return s.toUpperCase();
    });
  }
});

var mountNode6 = document.getElementById("sample6");
var code6 = mountNode6.innerHTML;
React.render(React.createElement(Highlight, {code: code6}, React.createElement(Dashboard1, null)), mountNode6);
});