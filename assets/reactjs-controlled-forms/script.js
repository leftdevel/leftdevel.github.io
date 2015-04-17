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
        React.createElement("div", null, "Welcome ", this.state.user.username), 
        React.createElement(Profile1, {
          initialUsername: this.state.user.username, 
          updateHandler: this._updateUsername})
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

var mountNode4 = document.getElementById("sample4");
var code4 = mountNode4.innerHTML;
React.render(React.createElement(Highlight, {code: code4}, React.createElement(Dashboard1, null)), mountNode4);

// ======== Sample 5 ========

var Profile2 = React.createClass({displayName: "Profile2",
  getInitialState: function() {
    return {editing: false};
  },

  render: function() {
    if (this.state.editing) {
      return (
        React.createElement("form", null, 
          React.createElement("label", null, "Username"), 
          React.createElement("input", {ref: "Username", defaultValue: this.props.initialUsername}), 
          React.createElement("button", {onClick: this._submit}, "Submit")
        )
      );
    } else {
      return (
        React.createElement("a", {href: "#", onClick: this._enterEditMode}, "Edit Profile")
      );
    }
  },

  _submit: function(event) {
    event.preventDefault();
    var value = React.findDOMNode(this.refs.Username).value;
    this.props.updateHandler(value);
    this.setState({editing: false});
  },

  _enterEditMode: function(event) {
    event.preventDefault();
    this.setState({editing: true});
  }
});

var Dashboard2 = React.createClass({displayName: "Dashboard2",
  getInitialState: function() {
    return {user: {username: 'John Doe'}};
  },

  render: function() {
    var formattedUsername = this._ucwords(this.state.user.username);

    return (
      React.createElement("div", null, 
        React.createElement("div", null, "Welcome ", formattedUsername), 
        React.createElement(Profile2, {
          initialUsername: this.state.user.username, 
          updateHandler: this._updateUsername})
      )
    );
  },

  _updateUsername: function(newUsername) {
    var state = this.state;
    state.user.username = newUsername;
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

var mountNode5 = document.getElementById("sample5");
var code5 = mountNode5.innerHTML;
React.render(React.createElement(Highlight, {code: code5}, React.createElement(Dashboard2, null)), mountNode5);

// end of on ready function
});