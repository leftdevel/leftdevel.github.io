document.addEventListener('DOMContentLoaded', function() {

var Highlight = window.app.Highlight;

// ======== Snippet 1 ========
var LogInForm1 = React.createClass({displayName: "LogInForm1",
  getLogInNode: function() {
    return (
      React.createElement("form", null, 
        React.createElement("label", null, "Username"), 
        React.createElement("input", {type: "text"}), 
        React.createElement("label", null, "Password"), 
        React.createElement("input", {type: "password"}), 
        React.createElement("button", null, "Log In")
      )
    );
  },

  getLogOutNode: function() {
    return (
      React.createElement("div", null, 
        "Hey John Doe, welcome on board!", 
        React.createElement("a", {href: "#"}, "Log Out")
      )
    );
  },

  render: function() {
      return this.getLogInNode();
  }
});

var mountNode1 = document.getElementById("sample1");
var code1 = mountNode1.innerHTML;

React.render(
  React.createElement(Highlight, {code: code1}, 
    React.createElement(LogInForm1, null)
  )
  , mountNode1);

// ========= Snippet 2 ========

var LogInForm2 = React.createClass({displayName: "LogInForm2",
  getInitialState: function() {
    return {
      loggedin: false,
      username: '',
      password: '',
    };
  },

  getLogInNode: function() {
    return (
      React.createElement("form", null, 
        React.createElement("label", null, "Username"), 

        React.createElement("input", {
          type: "text", 
          onChange: this._onUsernameChange, 
          value: this.state.username}
        ), 

        React.createElement("label", null, "Password"), 

        React.createElement("input", {
          type: "password", 
          onChange: this._onPasswordChange, 
          value: this.state.password}), 

        React.createElement("button", {onClick: this._logIn}, "Log In")
      )
    );
  },

  getLogOutNode: function() {
    return (
      React.createElement("div", null, 
        "Hey ", this.state.text, ", welcome on board!", 
        React.createElement("a", {href: "#", onClick: this._logOut}, "Log Out")
      )
    );
  },

  render: function() {
    if (!this.state.loggedin) {
      return this.getLogInNode();
    } else {
      return this.getLogOutNode();
    }
  },

  _onInputChange: function(event) {
     this.setState({text: event.target.value});
  },

  _logIn: function(event) {
    event.preventDefault();
    this.setState({loggedin: true});
  },

  _logOut: function(event) {
    event.preventDefault();
    this.setState({text: '', loggedin: false});
  }
});

// var mountNode2 = document.getElementById("sample2");
// React.render(<LogInForm2 />, mountNode2);

});