document.addEventListener('DOMContentLoaded', function() {
var Highlight = window.app.Highlight;

// ======== Sample 1 ========

var SimpleForm1 = React.createClass({
  render: function() {
    return (
      <form>
        <input ref="Email" defaultValue="" />
        <button onClick={this._submit}>Submit</button>
      </form>
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
React.render(<Highlight code={code1}><SimpleForm1 /></Highlight>, mountNode1);


// ======== Sample 2 ========

var SimpleForm2 = React.createClass({
  getInitialState: function() {
    return {email: ''};
  },

  render: function() {
    return (
      <form>
        <input value={this.state.email} onChange={this._onChange} />
        <button onClick={this._submit}>Submit</button>
      </form>
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
React.render(<Highlight code={code2}><SimpleForm2 /></Highlight>, mountNode2);

// ======== Sample 3 ========

var SimpleForm3 = React.createClass({
  getInitialState: function() {
    return {email: ''};
  },

  render: function() {
    return (
      <form>
        <input value={this.state.email} onChange={this._onChange} />
        <button onClick={this._submit}>Submit</button>
      </form>
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
React.render(<Highlight code={code3}><SimpleForm3 /></Highlight>, mountNode3);

// ======== Sample 4 ========

var Profile1 = React.createClass({
  getInitialState: function() {
    return {
      username: this.props.initialUsername,
      editing: false
    };
  },

  render: function() {
    if (this.state.editing) {
      return (
        <form>
          <label>Username</label>
          <input value={this.state.username} onChange={this._onChange} />
          <button onClick={this._submit}>Submit</button>
        </form>
      );
    } else {
      return (
        <a href="#" onClick={this._enterEditMode}>Edit Profile</a>
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

var Dashboard1 = React.createClass({
  getInitialState: function() {
    return {user: {username: 'John Doe'}};
  },

  render: function() {
    return (
      <div>
        <div>Welcome {this.state.user.username}</div>
        <Profile1
          initialUsername={this.state.user.username}
          updateHandler={this._updateUsername} />
      </div>
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
React.render(<Highlight code={code4}><Dashboard1 /></Highlight>, mountNode4);

// ======== Sample 5 ========

var Profile2 = React.createClass({
  getInitialState: function() {
    return {editing: false};
  },

  render: function() {
    if (this.state.editing) {
      return (
        <form>
          <label>Username</label>
          <input ref="Username" defaultValue={this.props.initialUsername} />
          <button onClick={this._submit}>Submit</button>
        </form>
      );
    } else {
      return (
        <a href="#" onClick={this._enterEditMode}>Edit Profile</a>
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

var Dashboard2 = React.createClass({
  getInitialState: function() {
    return {user: {username: 'John Doe'}};
  },

  render: function() {
    var formattedUsername = this._ucwords(this.state.user.username);

    return (
      <div>
        <div>Welcome {formattedUsername}</div>
        <Profile2
          initialUsername={this.state.user.username}
          updateHandler={this._updateUsername} />
      </div>
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
React.render(<Highlight code={code5}><Dashboard2 /></Highlight>, mountNode5);

// end of on ready function
});