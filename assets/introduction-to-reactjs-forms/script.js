document.addEventListener('DOMContentLoaded', function() {

var Highlight = window.app.Highlight;

// ======== Snippet 1 ========
var LogInForm1 = React.createClass({displayName: "LogInForm1",
  render: function() {
    if (!this.props.isLoggedIn) {
      return this.getLogInNode();
    } else {
      return this.getLogOutNode();
    }
  },
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
        "Welcome, John Doe. ", React.createElement("a", {href: "#"}, "Log Out")
      )
    );
  }
});

var mountNode1 = document.getElementById("sample1");
var code1 = mountNode1.innerHTML;

React.render(
  React.createElement(Highlight, {code: code1}, 
    React.createElement(LogInForm1, {isLoggedIn: false})
  )
  , mountNode1);

// ========= Snippet 2 ========

var LogInForm2 = React.createClass({displayName: "LogInForm2",
  getInitialState: function() {
    return {
      isLoggedIn: this.props.initialIsLoggedIn,
      isSubmitting: false,
      username: '',
      password: '',
    };
  },

  getLogInNode: function() {
    var wait = this.state.isSubmitting ? 'Authenticating. Please wait...' : '';

    return (
      React.createElement("form", null, 
        wait, 
        React.createElement("label", null, "Username"), 

        React.createElement("input", {
          type: "text", 
          onChange: this._onUsernameChange, 
          value: this.state.username, 
          disabled: this.state.isSubmitting}
        ), 

        React.createElement("label", null, "Password"), 

        React.createElement("input", {
          type: "password", 
          onChange: this._onPasswordChange, 
          value: this.state.password, 
          disabled: this.state.isSubmitting}
        ), 

        React.createElement("button", {disabled: this.state.isSubmitting, onClick: this._logIn}, "Log In")
      )
    );
  },

  getLogOutNode: function() {
    return (
      React.createElement("div", null, 
        "Welcome, John Doe. ", React.createElement("a", {href: "#", onClick: this._logOut}, "Log Out")
      )
    );
  },

  render: function() {
    if (!this.state.isLoggedIn) {
      return this.getLogInNode();
    } else {
      return this.getLogOutNode();
    }
  },

  _onUsernameChange: function(event) {
     this.setState({username: event.target.value});
  },

  _onPasswordChange: function(event) {
     this.setState({password: event.target.value});
  },

  _logIn: function(event) {
    event.preventDefault();
    this.setState({isSubmitting: true});

    // Mocking the server authentication request
    setTimeout(function() {
      this.setState({isSubmitting: false, isLoggedIn: true});
    }.bind(this), 2000);
  },

  _logOut: function(event) {
    event.preventDefault();
    this.setState({username: '', password: '', isLoggedIn: false});
  }
});

var initialIsLoggedIn = false; // we could pull this info from e.g., a webservice.

var mountNode2 = document.getElementById("sample2");
var code2 = mountNode2.innerHTML;

React.render(
  React.createElement(Highlight, {code: code2}, 
    React.createElement(LogInForm2, {initialIsLoggedIn: initialIsLoggedIn})
  )
  , mountNode2);


});