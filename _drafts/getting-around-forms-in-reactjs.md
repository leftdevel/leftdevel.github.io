---
layout: post
title:  "Getting around forms in ReactJS"
date:   2015-04-05 15:00:00
categories: reactjs state forms
---
Controlled vs Uncontrolled components. Client side vs server side validation. Have you tried to convince a russian guy that polish vodka is better? Well, let me talk you about forms in ReactJS.

One the hardest aspects to sell about ReactJS is the way it handles forms. Don't take me wrong though, ReactJS does not do any magic around them, but that's exactly what you might find unappealing.

<a id="in-perspective"></a>

### In Perspective [#](#in-perspective)

For example, AngularJS is quite oppinionated about forms:

* They get a shot of steroids by default, in fact the `<form>` tag is a built-in directive.
* You get validation out of the box.
* Metadata attributes like `pristine` and `dirty` are quite useful when handling certain scenarios.

In ReactJS kindom, forms are treated as mere peasants. The big difference is that we can do as little or as much as we want
with them. We could have deep levels of nested forms and it will be easier to handle with ReactJS than with
most JS libs out there.  This level of flexibility comes for free when the entire UI can be represented by the application state.

<a id="controlled-vs-uncontrolled-components"></a>

### Controlled vs Uncontrolled Components [#](#controlled-vs-uncontrolled-components)
First things first, let's see how they both differ from each other. Take a look to the following two components,
they both achieve the same exact thing (open your browser javascript console in order see the output).

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

The input value won't be updated if the component state is not updated. Try to comment out the `_onChange` method and you will notice that you won't be able to write into it, even though the `event` is still being fired.

This give us great flexibility, like the chance to pre-process the value, for example if you want to enforce upper case only and limit the lenght to 5 characters you can easily achieve that by refactoring the `onChange` method:

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

Something dangerous about controlled components is that you can break good programming practices in a few lines of code if not careful enough:

<div id="sample6">
{% highlight js %}
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

var Dashboard = React.createClass({
  getInitialState: function() {
    return {user: {username: 'John Doe'}};
  },
  render: function() {
    return (
      <div>
        <div>Welcome <strong>{this.state.user.username}</strong></div>
        <Profile initialUsername={this.state.user.username} updateHandler={this._updateUsername} />
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

React.render(<Dashboard />, mountNode);
{% endhighlight %}
</div>

Did you spot the issue? The Dashboard's `_updateUsername` method will convert your input to lowercase and then upercase the first letter. So if you entered "ivana humpalot", the Dashboard state will indeed get updated as we can see in the welcome message, but the form won't reflect those changes anymore because it handles its own state and uses `this.props.initialUsername` for [initialization only][props-in-state].

This is what we call breaking the _single source of truth_ principle, because the value for the username has now two sources instead of one, and we should avoid this bad practice at all cost.

In our example, this issue is pretty obvious, but in an app with many layers of sub-components, and with many historical refactors we could end with strange behaviours like this if we are not careful enough. And believe me, this is hard to debug.

Using a controlled component implies adding an `onChange` handler, that without a meaninful purpose it quickly becomes lousy code. If a controlled component achieves no more than an uncontrolled one, please save yourself from the hassle and use the latter.

<a id="conclusion"></a>

### Conclusion [#](#conclusion)

As we have seen there is a lot of boilerplate code to get a simple form fully working, and we haven't covered validation yet. The other side of the coin is that we have the opportunity to handle complex forms with ease, or ask the guys at [HipChat][hipchat].

And yes, polish vodka is the best. Don't belive me? I'll be glad to talk to you about my awesome trip to Poland last year. If you have any questions about vodka or about this post let me know in the comments section below and I'll be happy to help.

[controlled-and-uncontrolled-components]: https://facebook.github.io/react/docs/forms.html#controlled-components
[controller-view]: https://facebook.github.io/flux/docs/todo-list.html#listening-to-changes-with-a-controller-view
[props-in-state]: https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
[hipchat]: https://developer.atlassian.com/blog/2015/02/rebuilding-hipchat-with-react/

{% include js.html %}