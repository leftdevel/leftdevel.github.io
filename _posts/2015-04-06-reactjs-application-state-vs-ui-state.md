---
layout: post
title:  "ReactJS application state vs UI state"
date:   2015-04-06 04:05:00
categories: reactjs
tags: [reactjs, application state, UI state]
description: Differences between app state and UI state. # Add post description (optional)
img: react.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
---

To the inexperienced eye, there are not many differences between a Jackson Pollock painting and a doodle. Telling what's relevant from what is ephemeral information in ReactJS is not an easy task either.

ReactJS components let us throw as much data as we want into their state. However Flux's philosophy recommends us that only [controller-view][controller-view] components should manage an internal state and pass necessary data to its children through their props.

<a id="orchestrating-a-single-state"></a>

### Orchestrating a Single State [#](#orchestrating-a-single-state)

Say we have a MessageBox component that has three children components UnreadMessageCounter, MessageList and MessageComposer. We also have access to a MessageStore that will help us to fetch the necessary data about messages. The MessageBox would look something like this:

<div class="ignore-highlight-errors">
{% highlight js %}
  var MessageBox = React.createClass({
    getInitialState: function() {
        messages: MessageStore.getMessages(),
        unreadMessagesCount: MessageStore.getUnreadMessagesCount(),
    },
    render: function() {
      return (
        <div>
          <UnreadMessageCounter count={this.state.unreadMessagesCount} />
          <MessageList messages={this.state.messages} />
          <MessageComposer />
        </div>
      );
    },

    // We may want to register a mechanism to listen for changes in
    // the MessageStore, but that's beyond the scope of this example.
  }
  });
});
{% endhighlight %}
</div>

The benefit of this strategy is that if a node gets updated in the message list, we would certainly know that the event originated in the MessageBox when the state changed. This takes all the business logic complexity out of secondary components, and centralizes it into one single primary component.

But what does this has to do with application state vs UI state? Well, if we are following this philosophy about stateless secondary components we may feel tempted to throw most - if not all - our application data into the controller-view state.

This creates big challenges because we could break encapsulation, in other words higher hierarchy components will know too much about how their children work. This strives away from traditional OOP, where a given object knows nothing at all about the implementation details of the objects it depends on.

A good way to alleviate this is to make a distinction and separation between what's application state from what's UI state. Simple put, UI state is that kind of information that is ephemeral, exists in isolation, is not meaningful to other components, and belongs to the presentation layer only. Throwing this kind of data into the controller-view component condemns it to rot in no time.

<a id="totalitarianism"></a>

### Totalitarianism [#](#totalitarianism)

For example, we have an EditableLabel component that renders as a label but on double click it turns into an input, then on blur it turns again into a label displaying the updated value. We will hold three of them inside a List component.

<div id="sample1" class="ignore-highlight-errors">
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

I think we would agree this code is hard to follow and understand because there are cross-references between the two components. The List knows too much about how the EditableLabel component works. It tells the EditableLabel if it's value is being edited or not, and also dictates when to toggle between read and edit mode (see `_enterEditMode` and `_save` methods).

Maybe this would be acceptable if we needed to hook other features whenever we are editing a particular label, like disabling other components until the value has been updated, but this scenario is quite unlikely to happen.

<a id="encapsulation"></a>

### Encapsulation [#](#encapsulation)

Without a solid reason behind putting all the application data and functionality in the controller-view component we shouldn't be creating cross-references. Let's put the presentation layer code into the EditableLabel. Keep in mind the List will still be in charge of updating the values.

<div id="sample2" class="ignore-highlight-errors">
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
      ...
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
    ...
        <li key={index}>
          <EditableLabel
            text={row.text}
            saveHandler={this._save.bind(null, index)}
          />
        </li>
    ...
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

I know you might be thinking this is the same mess. The numbers of lines didn't really change, however unnecessary cross-references between the components were reduced by 50%, the List now passes two property values instead of four. Before, the List had to pass the `editing` property to EditableList as well as a handler to take care of entering in edit mode.

Notice we could have left the `editing` property in the List rows, while letting the EditableLabel to hold the `_enterEditMode` functionality, but `editing` is only a concern of the EditableLabel.

If both components were defined in separated files we wouldn't need to switch between them repeatedly to figure out how it all works. The List now only cares about receiving a new value in order to update its state. Everything got greatly simplified by just removing the `editing` property out of the List state.

To recapitulate a bit, the reasons behind moving the `editing` property out of the List state are:

* It's only important to the EditableLabel component scope.
* It's ephemeral data, since it's only required to toggle between edit and read mode. It's definitely UI state.
* Keeping it inside EditableLabel greately simplifies how the whole application works, and removes noisy code out of the controller-view component.

<a id="conclusion"></a>

### Conclusion [#](#conclusion)

Abusing state is bad, really bad, and we'll be living in sin whenever we have too few or too many states laying around. It creates a lot of unnecessary complexity in both cases. Finding a good balance is the key to create more robust components.

There is still more about this topic like form validation errors. Where should an input validation error message live? What about server validation errors? I'll try to cover all of this in a later post about forms.

If you have any question let me know in the comments section below. Thanks for reading.

[controller-view]: https://facebook.github.io/flux/docs/todo-list.html#listening-to-changes-with-a-controller-view

{% include js.html %}