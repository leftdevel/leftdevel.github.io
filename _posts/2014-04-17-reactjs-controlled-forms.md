---
layout: post
title:  "ReactJS and controlled forms"
date:   2015-04-17 04:00:00 -0600
categories: reactjs forms
tags: [reactjs, forms]
description: Controlled vs uncontrolled components. # Add post description (optional)
img: react.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
---
Let's talk about controlled vs uncontrolled components and why gambling with them can be dangerous. Incorrect usage may lead to unexpected behaviors like  breaking the _single source of truth_ principle.

You may have already read about them in the [official docs][controlled-and-uncontrolled-components], but let's recap how they both differ from each other. Take a look to the following two form components, they both achieve the same thing (open your browser's javascript console in order see the output when clicking the submit button).

**Uncontrolled**.

<div id="sample1" class="ignore-highlight-errors">
{% highlight js %}
var SimpleForm = React.createClass({
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

React.render(<SimpleForm />, mountNode);
{% endhighlight %}
</div>

**Controlled**.

<div id="sample2" class="ignore-highlight-errors">
{% highlight js %}
var SimpleForm = React.createClass({
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

React.render(<SimpleForm />, mountNode);
{% endhighlight %}
</div>

An input will be controlled whenever we declare the `value` attribute (as opposite to uncontrolled component, which makes use of `defaultValue`). This let ReactJS take total control over the input.

The input value won't be updated if the component state is not updated. If we comment out the `_onChange` method we won't be able to modify the input, even though the `event` is still being fired.

This give us great flexibility, like the chance to pre-process the value, for example if we want to enforce upper case only and limit the length to five characters we can easily achieve that by refactoring the `onChange` method:

<div id="sample3" class="ignore-highlight-errors">
{% highlight js %}
  ...
  _onChange: function(event) {
    var value = event.target.value;
    if (value.length > 5) return;
    this.setState({email: value.toUpperCase()});
  }
  ...
});
{% endhighlight %}
</div>

Imagine that we are writing a chat application and we want to show a `John Doe is typing..` message to the other participants; that would be a breeze to achieve thanks to the onChange handler. In practice, however, we won't always need such fine-grained level of control.

<a id="beware-of-mad-component"></a>

### Beware of mad component [#](#beware-of-mad-component)

Something to be careful about controlled components is that we can end up breaking the _single source of truth_ principle. The following component let us update our full name and will apply a nice formatting to it, so if we enter "ivanNa HUMpalOT" it will be converted to "Ivanna Humpalot":

<div id="sample4" class="ignore-highlight-errors">
{% highlight js %}
// PROFILE

var Profile = React.createClass({
  getInitialState: function() {
    return {
      username: this.props.initialUsername, // anti-pattern
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

// DASHBOARD

var Dashboard = React.createClass({
  getInitialState: function() {
    return {user: {username: 'John Doe'}};
  },
  render: function() {
    return (
      <div>
        <div>Welcome {this.state.user.username}</div>
        <Profile
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
  _ucwords: function(str) {
    // Ommited for brevity.
  }
});

React.render(<Dashboard />, mountNode);
{% endhighlight %}
</div>

Did you spot the issue? The Dashboard's `_updateUsername` method will successfully convert the input and update the Dashboard's state as we can see in the welcome message, but the form won't reflect it because it handles its own state and uses `this.props.initialUsername` for [initialization only][props-in-state]. (Throwing props into a component's state is an antipattern too, yikes!).

The sad part of the story is that the new initialUsername value is still being passed down to the Profile component after the Dashboard state has been updated, but the component no longer makes use of it.

Inadvertently we have broken  the _single source of truth_ principle, because the value for the username now lives inside the Dashboard state and inside the Profile state as well, and we should avoid this bad practice at all cost.

In our example, this issue might be easy to spot after one or  two re-reads, but in an app with many layers of sub-components, and with many historical refactors this bug will await patiently to show up in the worst moment. And believe me, this is hard to debug.

Using a controlled input component also implies adding an `onChange` handler that without a meaningful purpose it quickly becomes lousy code. If a controlled component achieves no more than an uncontrolled one, please save yourself from the hassle and use the latter.

To avoid breaking the _single source of truth_ principle the rule of thumb is that an application data element should live in one and only one component state. If we need different representations of the same data, then the solution is - besides keeping it in a single state - to let other components to _decorate_ it only.

<a id="a-better-solution"></a>

### A better solution [#](#a-better-solution)

<div id="sample5" class="ignore-highlight-errors">
{% highlight js %}
var Profile = React.createClass({

  // Notice we aren't storing the username in the Profile anymore
  getInitialState: function() {
    return {
      editing: false
    };
  },

  render: function() {
    if (this.state.editing) {
      return (
        ...
          // The username now comes from the props and not the state.
          // The input is now uncontrolled, so no more onChange handling.
          // The 'ref' will be used in the _submit handler
          <input ref="Username" defaultValue={this.props.initialUsername} />
        ...
      );
    } else {
      ...
    }
  },

  _submit: function(event) {
    event.preventDefault();
    var value = React.findDOMNode(this.refs.Username).value;
    this.props.updateHandler(value);

    // Editing is still being handled by the Profile component
    this.setState({editing: false});
  },

  _enterEditMode: function(event) {
    ...
  }
});

var Dashboard = React.createClass({
  getInitialState: function() {
    return {user: {username: 'John Doe'}};
  },

  render: function() {
    // Notice the formatting happens on the fly and for the welcome message only
    var formattedUsername = this._ucwords(this.state.user.username);

    return (
      <div>
        <div>Welcome {formattedUsername}</div>
        <Profile
          initialUsername={this.state.user.username}
          updateHandler={this._updateUsername} />
      </div>
    );
  },

  _updateUsername: function(newUsername) {
    var state = this.state;

    // The value is saved raw
    state.user.username = newUsername;
    this.setState(state);
  },

  // Only used in the render method
  _ucwords: function(str) {
    // Ommited for brevity
  }
});

React.render(<Dashboard />, mountNode);
{% endhighlight %}
</div>

Hopefully  the inline comments will point out the major changes in our code. In short, the Profile component no longer handles the username state, rather it's a channel between the end user and the Dashboard component. However notice the `editing` attribute is still being part of the Profile, maybe we agree that the Dashboard won't benefit at all from knowing about the inner cogs of the Profile.

The value is being passed raw from the Profile to the Dashboard's `_updateUsername` handler, and is being saved raw into the state as well. The render method makes use of the _ucwords function to give the username a nicer display representation on the fly.

<a id="conclusion"></a>

### Conclusion [#](#conclusion)

Controlled vs uncontrolled form components is a very simple concept, yet we may find ourselves failing to choose wisely if we are not careful enough to foresee big upcoming refactors where forms needs to be split into smaller and more abstract pieces.

Have you faced these issues at all? Please share your experience with forms in the comments sections below. If you have any question write them down too. Thanks for reading.

[props-in-state]: https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
[controlled-and-uncontrolled-components]: https://facebook.github.io/react/docs/forms.html#controlled-components
[controller-view]: https://facebook.github.io/flux/docs/todo-list.html#listening-to-changes-with-a-controller-view
[todd]: http://todsul.com/
[trello]: http://trello.com/

<style>
  form .row label {
    display: block;
  }
  form .row, {
      display: block;
  }

  form .row .error {
    color: red;
  }
</style>

{% include js.html %}