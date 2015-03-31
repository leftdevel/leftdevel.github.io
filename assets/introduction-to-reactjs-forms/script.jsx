document.addEventListener('DOMContentLoaded', function() {

var Highlight = window.app.Highlight;

// ======== Snippet 1 ========
var LogInForm1 = React.createClass({
  render: function() {
    if (!this.props.isLoggedIn) {
      return this.getLogInNode();
    } else {
      return this.getLogOutNode();
    }
  },
  getLogInNode: function() {
    return (
      <form>
        <label>Username</label>
        <input type="text" />
        <label>Password</label>
        <input type="password" />
        <button>Log In</button>
      </form>
    );
  },
  getLogOutNode: function() {
    return (
      <div>
        Welcome, John Doe. <a href="#">Log Out</a>
      </div>
    );
  }
});

var mountNode1 = document.getElementById("sample1");
var code1 = mountNode1.innerHTML;

React.render(
  <Highlight code={code1} >
    <LogInForm1 isLoggedIn={false} />
  </Highlight>
  , mountNode1);

// ========= Snippet 2 ========

var LogInForm2 = React.createClass({
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
      <form>
        {wait}
        <label>Username</label>

        <input
          type="text"
          onChange={this._onUsernameChange}
          value={this.state.username}
          disabled={this.state.isSubmitting}
        />

        <label>Password</label>

        <input
          type="password"
          onChange={this._onPasswordChange}
          value={this.state.password}
          disabled={this.state.isSubmitting}
        />

        <button disabled={this.state.isSubmitting} onClick={this._logIn}>Log In</button>
      </form>
    );
  },

  getLogOutNode: function() {
    return (
      <div>
        Welcome, John Doe. <a href="#" onClick={this._logOut}>Log Out</a>
      </div>
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
  <Highlight code={code2}>
    <LogInForm2 initialIsLoggedIn={initialIsLoggedIn} />
  </Highlight>
  , mountNode2);


});