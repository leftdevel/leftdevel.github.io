document.addEventListener('DOMContentLoaded', function() {

var Highlight = window.app.Highlight;

// ======== Snippet 1 ========
var LogInForm1 = React.createClass({
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
        Hey John Doe, welcome on board!
        <a href="#">Log Out</a>
      </div>
    );
  },

  render: function() {
      return this.getLogInNode();
  }
});

var mountNode1 = document.getElementById("sample1");
var code1 = mountNode1.innerHTML;

React.render(
  <Highlight code={code1} >
    <LogInForm1 />
  </Highlight>
  , mountNode1);

// ========= Snippet 2 ========

var LogInForm2 = React.createClass({
  getInitialState: function() {
    return {
      loggedin: false,
      username: '',
      password: '',
    };
  },

  getLogInNode: function() {
    return (
      <form>
        <label>Username</label>

        <input
          type="text"
          onChange={this._onUsernameChange}
          value={this.state.username}
        />

        <label>Password</label>

        <input
          type="password"
          onChange={this._onPasswordChange}
          value={this.state.password} />

        <button onClick={this._logIn}>Log In</button>
      </form>
    );
  },

  getLogOutNode: function() {
    return (
      <div>
        Hey {this.state.text}, welcome on board!
        <a href="#" onClick={this._logOut}>Log Out</a>
      </div>
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