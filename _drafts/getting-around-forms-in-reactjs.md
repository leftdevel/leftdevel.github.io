---
layout: post
title:  "Getting around forms in ReactJS"
date:   2015-03-27 15:20:00
categories: reactjs state forms
---
Controlled vs Uncontrolled components. Application state vs UI state. Have you tried to convince a russian guy that polish vodka is better? Well, let me talk you about forms in ReactJS.

One the hardest thing to sell about ReactJS is the way it handles forms. Don't take me wrong though, ReactJS does not do any magic around them, and that's probably
what you might find unappealing.

<a id="in-perspective"></a>

### In Perspective [#](#in-perspective)

For example, AngularJS is quite oppinionated about forms:

* They get a shot of steroids by default, in fact the `<form>` tag is a built-in directive.
* You get validation out of the box.
* Metadata attributes like `pristine` and `dirty` are quite useful when handling certain scenarios.

In ReactJS kindom, forms are threated as mere peasants. The big difference is that you can do as little or as much as you want
with them. You could have deep levels of nested forms and it will be easier to handle with ReactJS than with
most JS libs out there.  This level of flexibility comes for free when the entire UI can be represented by the application state.ss

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

According to the [official documentation][controlled-and-uncontrolled-components], an input will be controlled whenever we declare the `value` attribute (as opposit of the uncontrolled component, which makes use of `defaultValue`). This let ReactJS take total control over the input. The input value won't be updated if the component state is not updated. Try to comment out the `_onChange` method and you will notice that you won't be able to write into it, even though the `event` is still being fired.

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

Imagine for example that we are writing a chat application, and we want to show a `John Doe is typing..` message to the other participants; that would be a breeze to achieve in the onChange handler. In practice, however, you will soon realize you won't always need such fine grained control.

Adding an `onChange` without a meaninful purpose  quickly becomes lousy code. If a controlled component achieves no more than an uncontrolled one, please save yourself from the hassle and use the latter.

<a id="application-state-vs-ui-state"></a>

### Application State vs UI State [#](#application-state-vs-ui-state)

ReactJS components let you throw as much data as you want into their state. However the Flux philosophy recommends us that only [controller-view][controller-view] components should manage a state and pass data to its children through their props. So for instance, if you have a MessageBox component that has three children UnreadMessageCounter, MessageList and MessageComposer, only MessageBox should manage a state.

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

The benefit of this strategy is that if some node updates in the message list, we would certainly know that the event originated in the MessageBox, because its state changed. This takes all the business logic complexity out of secondary components, and centralizes it into one single primary component. For instance you could have a couple of controller-view components in a page.

What does this has to do with application state vs ui state? Well, if you are following this philosphy about stateless secondary components you may feel tempted to throw most - if not all - of your application data into the controller-view state.

This creates its own challenges, because we could break encapsulation, in other words higher hierarchy components will know too much about their children. This strives away from traditional OOP, where parent objects know nothing at all about the implementation details of the objects they depend on.

A good way to alivate this is to make a distinction and separation between what's application state from what's UI state. Simple put, UI state is that kind of information that is ephimeral, exists in isolation and is not meaninful to other components, and belongs to the presentation layer only. Throwing this kind of data into the controller-view component makes it to rot in no time.

For example, we have a EditableLabel component that renders as a label but on double click it turns into an input, on blur it turns into a label again displaying the updated value. We will hold three of them in a List component.

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
        <label onDoubleClick={this.props.displayInputHandler}>{this.props.text}</label>
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
            displayInputHandler={this._displayInput.bind(null, index)}
            saveHandler={this._save.bind(null, index)}
          />
        </li>
      );
    }.bind(this));

    return (
      <ul>{liNodes}</ul>
    );
  },
  _displayInput: function(index) {
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

With all honesty I'd say this code is hard to follow because there are many paths and references between the two components. The List knows too much about how the EditableLabel component works.
That would be fine if we needed to hook other features whenever we are editing a particular label, maybe we would want to disable other components in the page while the user is in edit mode.

But without a strong reason to follow this design we shouldn't be creating cross references. Let's put the presentation layer code into the EditableLabel. Keep in mind the List will be still intersted to be in charge of the state update.

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
        <label onDoubleClick={this._displayInput}>{this.props.text}</label>
      );
    }
  },
  _displayInput: function() {
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

I know you might be thinking this is the same mess. The numbers of lines didn't really change, however unnecessary cross references between the components were reduced by 66%. Before, the List had to pass the `editing` property to EditableList as well as a handler to take care of toggling the value.

Of course, we could have left the `editing` property in the List rows, while letting the EditableLabel to handle the _displayInput function, but let's remember `editing` is only a concern of the EditableLabel.

If both components were defined in separated files we wouldn't need to switch between them repeatedly to figure out how it all works. The List now only cares about receiving a new value in order to update its state. Everything got greatelly simplified by just removing the `editing` property out of the List state.

To recapitulate a bit, the reasons behind moving the `editing` property out of the List state are:

* It's only important to the EditableLabel component scope.
* It's ephimeral data, since it's only required to toggle between edit mode and read mode. It's definitely UI state.
* Keeping it inside EditableLabel greately simplifies how the whole application works, and removes noisy code out of the controller-view component.

Application state vs UI state dilema is not only found when working with forms, but in my experience it's there were it will become a major issue.

<a id="conclusion"></a>

### Conclusion [#](#conclusion)

Getting forms right in ReactJS is a big challenge, and what we covered so far are the first concerns and errors I found myself doing back in the early days.

Sometimes you could be tempted to write a controlled component from the very begnining, but maybe what you need is a uncontrolled component. Maybe you'll be tempted to throw too much into a sub-component state, or too much into the controller-view.

The key is to find the good balance. Remember there is still a lot left to get right like abstracting and reusing forms, as well as validation. Those are big topics that I'll try to cover in a later post.

I know, there is a lot of boilerplate code to get a simple form fully working, if what you need is to write a simple login form in your website, consider using jQuery. But if what you need is to create rich multi step forms, or the next [HipChat web app][hipchat], look no more, pick ReactJS.

And yes, polish vodka is the best. Don't belive me? I'll be glad to talk you about my awesome trip to Poland last year. If you have any questions about vodka or the code snippets let me know in the comment section below and I'll be happy to help.

[controlled-and-uncontrolled-components]: https://facebook.github.io/react/docs/forms.html#controlled-components
[controller-view]: https://facebook.github.io/flux/docs/todo-list.html#listening-to-changes-with-a-controller-view
[hipchat]: https://developer.atlassian.com/blog/2015/02/rebuilding-hipchat-with-react/

{% include js.html %}