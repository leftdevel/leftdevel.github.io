---
layout: post
title:  "Getting around forms in ReactJS"
date:   2015-03-27 15:20:00
categories: reactjs state forms
---
Controlled vs Uncontrolled components. Application state vs UI state. Have you tried to convince a russian guy that polish vodka is better? Well, let me talk you about forms in ReactJS.

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

<a id="application-state-vs-ui-state"></a>

### Application State vs UI State [#](#application-state-vs-ui-state)

ReactJS components let you throw as much data as you want into their state. However the Flux philosophy recommends us that only [controller-view][controller-view] components should manage a state and pass data to its children through their props. If we had a MessageBox component that has three children components UnreadMessageCounter, MessageList and MessageComposer, only MessageBox should manage a state.

<div>
{% highlight js %}
  var MessageBox = React.createClass({
    getInitialState: function() {
        messages: MessageStore.getMessages(),
        unreadMessagesCount: MessageStore.getUnreadMessagesCount(),
    },
    render: function() {
      return (
        <div>
          <UnreadMessageCounter count={this.state.unreadMessageCount} />
          <MessageList messages={this.state.messages} />
          <MessageComposer />
        </div>
      );
    }
  }
  });
});
{% endhighlight %}
</div>

The benefit of this strategy is that if a node gets updated in the message list, we would certainly know that the event originated in the MessageBox when the state changed. This takes all the business logic complexity out of secondary components, and centralizes it into one single primary component.

But what does this has to do with application state vs UI state? Well, if we are following this philosphy about stateless secondary components we may feel tempted to throw most - if not all - of our application data into the controller-view state.

This creates its own challenges, because we could break encapsulation, in other words higher hierarchy components will know too much about how their children work. This strives away from traditional OOP, where parent objects know nothing at all about the implementation details of the objects they depend on.

A good way to alivate this is to make a distinction and separation between what's application state from what's UI state. Simple put, UI state is that kind of information that is ephimeral, exists in isolation and is not meaninful to other components, and belongs to the presentation layer only. Throwing this kind of data into the controller-view component condemns it to rot in no time.

For example, we have an EditableLabel component that renders as a label but on double click it turns into an input, then on blur it turns into a label again displaying the updated value. We will hold three of them inside a List component.

<div id="sample4">
{% highlight js %}
var EditableLabel = React.createClass({
  componentDidUpdate: function() {
    if (this.props.editing) {
      React.findDOMNode(this.refs.TheInput).focus();
    }
  },
  render: function() {
    if (this.props.editing) {
      return (
        <input ref="TheInput" defaultValue={this.props.text} onBlur={this._onBlur} />
      );
    } else {
      return (
        <label onDoubleClick={this.props.enterEditModeHandler}>{this.props.text}</label>
      );
    }
  },
  _onBlur: function() {
    var value = React.findDOMNode(this.refs.TheInput).value;
    this.props.saveHandler(value);
  }
});

var List = React.createClass({
  getInitialState: function() {
    return { rows: [
        {editing: false, text: "Double click me"},
        {editing: false, text: "Double Click me too"},
        {editing: false, text: "Double click me already"}
      ]
    };
  },
  render: function() {
    var liNodes = this.state.rows.map(function(row, index) {
      return (
        <li key={index}>
          <EditableLabel
            text={row.text}
            editing={row.editing}
            enterEditModeHandler={this._enterEditMode.bind(null, index)}
            saveHandler={this._save.bind(null, index)}
          />
        </li>
      );
    }.bind(this));

    return (
      <ul>{liNodes}</ul>
    );
  },
  _enterEditMode: function(index) {
    var rows = this.state.rows;
    rows[index].editing = true;
    this.setState({rows: rows});
  },
  _save: function(index, value) {
    var rows = this.state.rows;
    rows[index].text = value;
    rows[index].editing = false;
    this.setState({rows: rows});
  }
});

React.render(<List />, mountNode);
{% endhighlight %}
</div>

I think we would agree this code is hard to follow and understand because there are cross-references between the two components. The List knows too much about how the EditableLabel component works.

Notice that the List knows it has to pass an `editing` property to the EditableLabel component, and also dictates how to toggle this property in the `_enterEditMode` handler.

That would be fine if we needed to hook other features whenever we are editing a particular label, maybe we would want to disable other components in the page while the user is in edit mode.

But without a strong reason to follow this design we should not create cross-references. Let's put the presentation layer code into the EditableLabel. Keep in mind the List will be still in charge of handling the save functionality.

<div id="sample5">
{% highlight js %}
var EditableLabel = React.createClass({
  componentDidUpdate: function() {
    ...
  },
  getInitialState: function() {
    return {editing: false};
  },
  render: function() {
    if (this.state.editing) {
      return (
        <input ref="TheInput" defaultValue={this.props.text} onBlur={this._onBlur} />
      );
    } else {
      return (
        <label onDoubleClick={this._enterEditMode}>{this.props.text}</label>
      );
    }
  },
  _enterEditMode: function() {
    this.setState({editing: true});
  },
  _onBlur: function() {
    var value = React.findDOMNode(this.refs.TheInput).value;
    this.props.saveHandler(value);
    this.setState({editing: false});
  }
});

var List = React.createClass({
  getInitialState: function() {
    return { rows: [
        {text: "Double click me"},
        {text: "Double Click me too"},
        {text: "Double click me already"}
      ]
    };
  },
  render: function() {
    var liNodes = this.state.rows.map(function(row, index) {
      return (
        <li key={index}>
          <EditableLabel
            text={row.text}
            saveHandler={this._save.bind(null, index)}
          />
        </li>
      );
    }.bind(this));

    return (
      <ul>{liNodes}</ul>
    );
  },
  _save: function(index, value) {
    var rows = this.state.rows;
    rows[index].text = value;
    this.setState({rows: rows});
  }
});

React.render(<List />, mountNode);
{% endhighlight %}
</div>

I know you might be thinking this is the same mess. The numbers of lines didn't really change, however unnecessary cross-references between the components were reduced by 66%. Before, the List had to pass the `editing` property to EditableList as well as a handler to take care of entering in edit mode.

In the other hand, we could have left the `editing` property in the List rows, while letting the EditableLabel to hold the `_enterEditMode` functionality, but `editing` is only a concern of the EditableLabel.

If both components were defined in separated files we wouldn't need to switch between them repeatedly to figure out how it all works. The List now only cares about receiving a new value in order to update its state. Everything got greatelly simplified by just removing the `editing` property out of the List state.

To recapitulate a bit, the reasons behind moving the `editing` property out of the List state are:

* It's only important to the EditableLabel component scope.
* It's ephimeral data, since it's only required to toggle between edit mode and read mode. It's definitely UI state.
* Keeping it inside EditableLabel greately simplifies how the whole application works, and removes noisy code out of the controller-view component.

Application state vs UI state dilema is not only found when working with forms, but in my experience it's here were it will become a major issue.

<a id="conclusion"></a>

### Conclusion [#](#conclusion)

As we have seen there is a lot of boilerplate code to get a simple form fully working, and we haven't covered validation yet. The other side of the coin is that we have the opportunity to handle complex forms with ease, or ask the guys at [HipChat][hipchat].

And yes, polish vodka is the best. Don't belive me? I'll be glad to talk to you about my awesome trip to Poland last year. If you have any questions about vodka or about this post let me know in the comments section below and I'll be happy to help.

[controlled-and-uncontrolled-components]: https://facebook.github.io/react/docs/forms.html#controlled-components
[controller-view]: https://facebook.github.io/flux/docs/todo-list.html#listening-to-changes-with-a-controller-view
[props-in-state]: https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
[hipchat]: https://developer.atlassian.com/blog/2015/02/rebuilding-hipchat-with-react/

{% include js.html %}