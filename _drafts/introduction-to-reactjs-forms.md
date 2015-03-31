---
layout: post
title:  "Introduction to ReactJS forms"
date:   2015-03-27 15:20:00
categories: reactjs state forms
---
Application state vs UI state. Controlled vs uncontrolled components. Abstracting & reusing widgets. Give your forms that shot of steroids right from the begining; free of guilt.

You can easily find yourself having a hard time with forms right from the begining. Did you know you can even design forms in three different ways? Yay! Isn't that awesome?

...No, wait, nooo. That's actually terrible, our goal must be to solve a problem (or group of problems) in a consistent way. ReactJS is not inmune to spaghetti code but thankfully it's brilliantly designed so the amount of options for screwing the pooch are at minimum.

<a id="one-problem-three-solutions"></a>

### One Problem, Three Solutions [#](#one-problem-three-solutions)

We will build a very simple login form with a few requirements: We enter a username and password, we hit submit, the form hides, we show a success message with a logout link that will switch back to the login form. Let's see the minimum amount of code possible, just enough to see what will be we trying to do.

<div id="sample1">
{% highlight js %}
/* Snippet 1 */
var LogInForm = React.createClass({
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

React.render(<LogInForm isLoggedIn={false} />, mountNode);
{% endhighlight %}
</div>

As we can see, there is not much fun going on. We rely on `isLoggedIn` property to toggle between the Log-In and Log-Out views.

In a real world scenario we would also like to submit the form to a backend server, and while the server is processing our request we would like to show a 'loading' message and disable the Log-In form during that period to avoid re-submitting the form. Not really hard, is it? We can throw all the important info into the component's state, hold my beer:

<div id="sample2">
{% highlight js %}
/* Snippet 2 */
var LogInForm = React.createClass({
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

React.render(<LogInForm initialIsLoggedIn={initialIsLoggedIn} />, mountNode);
{% endhighlight %}
</div>

Mark heard we love ReactJS, he also tell us all Facebook engineers are busy working on Relay and GraphQL. He want us to do a simple job, to let people to edit a comment with the less amount of effort.

{% include js.html %}