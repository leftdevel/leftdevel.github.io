---
layout: post
title:  "ReactJS why forms are hard"
date:   2015-04-15 15:00:00
categories: reactjs forms
---
Let's talk about controlled vs uncontrolled components and why gambling with them can be dangerous. Incorrect usage may lead to unexpected behaviors like  breaking the _single source of truth_ principle. Also, we will see different flavors to build forms.

If you like plot twists I have a good one for you: React doesn't apply any magic to forms ... Wait for it ... But that's exactly what you might find unappealing.

<a id="in-perspective"></a>

### In Perspective [#](#in-perspective)

For example, AngularJS is quite oppinionated about forms:

* They get a shot of steroids by default, in fact the `<form>` tag is a built-in directive.
* You get validation out of the box.
* Metadata attributes like `pristine` and `dirty` are quite useful when handling certain scenarios.

In ReactJS kindom, forms are treated as mere peasants. The difference is that we have no restrictions about the way we can handle complex scenarios, like nestings collection of forms inside other forms, or abstracting & reusing custom form components. This level of flexibility comes for free when the entire UI can be represented by the application state.

For now we will just give an overview about avoiding common mistakes and bad architectural design.

<a id="controlled-vs-uncontrolled-components"></a>

### Controlled vs Uncontrolled Components [#](#controlled-vs-uncontrolled-components)

First things first, let's see how they both differ from each other. Take a look to the following two components,
they both achieve the same exact thing (open your browser's javascript console in order see the output).

**Uncontrolled**.

<div id="sample1">
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

<div id="sample2">
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

According to the [official documentation][controlled-and-uncontrolled-components], an input will be controlled whenever we declare the `value` attribute (as opposit of the uncontrolled component, which makes use of `defaultValue`). This let ReactJS take total control over the input.

The input value won't be updated if the component state is not updated. Try to comment out the `_onChange` method and you will notice that you won't be able to write in it, even though the `event` is still being fired.

This give us great flexibility, like the chance to pre-process the value, for example if you want to enforce upper case only and limit the lenght to five characters you can easily achieve that by refactoring the `onChange` method:

<div id="sample3">
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

Imagine that we are writing a chat application and we want to show a `John Doe is typing..` message to the other participants; that would be a breeze to achieve in the onChange handler. In practice, however, you will soon realize you won't always need such fine grained control.

<a id="beware-mad-component"></a>

### Beware, mad component [#](#beware-mad-component)

Something to be careful about controlled components is that you can end up breaking the _single source of truth_ principle. The following component let us update our full name and will apply a nice formatting, so if we enter "ivanNa HUMpalOT" it will be converted to "Ivanna Humpalot":

<div id="sample4">
{% highlight js %}
// PROFILE

var Profile = React.createClass({
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

// DASHBOARD

var Dashboard = React.createClass({
  getInitialState: function() {
    return {user: {username: 'John Doe'}};
  },
  render: function() {
    return (
      <div>
        <div>Welcome <strong>{this.state.user.username}</strong></div>
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

Did you spot the issue? The Dashboard's `_updateUsername` method will successfully convert the input and update the Dashboard's state as we can see in the welcome message, but the form won't reflect it because it handles its own state and uses `this.props.initialUsername` for [initialization only][props-in-state].

Notice that the new initialUsername value is still being passed down to the Profile component after the Dashboard state has been updated, but the component no longer makes use of it.

Inadvertently we have broken  the _single source of truth_ principle, because the value for the username now lives inside the Dashboard state and also inside the Profile state, and we should avoid this bad practice at all cost.

In our example, this issue might be easy to spot after one or  two re-reads, but in an app with many layers of sub-components, and with many historical refactors this bug will await patiently to show up in the worst moment. And believe me, this is hard to debug.

Using a controlled input component implies adding an `onChange` handler and without a meaninful purpose it quickly becomes lousy code. If a controlled component achieves no more than an uncontrolled one, please save yourself from the hassle and use the latter.

To avoid breaking the _single source of truth_ principle the rule of thumb is that an application data element should live in one and only one component state. If we need diferent representations of the same data, then the solution is - besides keeping it in a single state - to let other components to _decorate_ it only.

**A better solution**

<div id="sample5">
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
          // We've also removed the need for the username to be a
          // controlled component. No more onChange handling.
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

<!--
<a id="conclusion"></a>

### Conclusion [#](#conclusion)

As we have seen there is a lot of boilerplate code to get a simple form fully working, and we haven't covered validation yet. The other side of the coin is that we have the opportunity to handle complex forms with ease, or ask the guys at [HipChat][hipchat].

And yes, polish vodka is the best. Don't belive me? I'll be glad to talk to you about my awesome trip to Poland last year. If you have any questions about vodka or about this post let me know in the comments section below and I'll be happy to help.

@TODO talk about when a component is controlled. If value is provided then there must be an onChange handler. Also if the prop or state is undefined the component is treated as uncontrolled.

-->

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