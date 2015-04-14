---
layout: post
title:  "ReactJS forms overview"
date:   2015-04-14 15:00:00
categories: reactjs state forms
---
Controlled vs uncontrolled components and not breaking the single source of truth principle. Client side vs server side validation handling. And other things you should consider when building forms.

One the hardest ReactJS selling points is the way it handles forms. Don't take me wrong though, there is no magic involved, but that's exactly what you might find unappealing.

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

Something dangerous about controlled components is that you can end up breaking the _single source of truth_ principle. The following component let's a user to update his full name by applying a nice formatting, so if we enter "ivanNa HUMpalOT" it will be converted to "Ivanna Humpalot":

<div id="sample4">
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

Did you spot the issue? The Dashboard's `_updateUsername` method will successfully convert the input and update the Dashboard's state as we can see in the welcome message, but the form won't reflect those changes anymore because it handles its own state and uses `this.props.initialUsername` for [initialization only][props-in-state].

Notice that the new initialUsername value is being passed down to the Profile component after the Dashboard state has been updated, but the component no longer makes use of it.

Inadvertently we have broken  the _single source of truth_ principle, because the value for the username now lives inside the Dashboard state and also inside the Profile state, and we should avoid this bad practice at all cost.

In our example, this issue might be easy to spot after a couple of manual tests, but in an app with many layers of sub-components, and with many historical refactors this bug will await patiently to show up in the worst moment. And believe me, this is hard to debug.

Using a controlled input component implies adding an `onChange` handler, that without a meaninful purpose it quickly becomes lousy code. If a controlled component achieves no more than an uncontrolled one, please save yourself from the hassle and use the latter.

<a id="validation"></a>

### Validation [#](#validation)

What can we say? We are pretty much left alone in this regard. ReactJS ships with zero form validation support. But if we think for a moment this might be a blessing instead of a curse.

I personally believe there is no such thing as "the right way" to validate forms. Large range of javascript frameworks have some sort of validation layer, and most of them do it differently forcing us to learn yet another way to solve an universal problem.

There is an underlying beauty on simplicity. While helping [Todd][todd] to develop a Flux + React app, he started looking at how [Trello][trello] handles errors. If you haven't tried Trello yet I can only say it's one of the best UX designed single page applications I've ever seen.

I can't remember seeing a form error message in the past three years since I started using it. The key (which Todd conceptualized and that I agreed on) is to keep forms really simple and let the backend to do the heavy work to validate the user input.

In Alice in Wonderland, there are no input constraints, but if circumstances forces us to have them, then we  should make things as simple as possible to avoid end user frustration.

If we want to prevent a user from submitting more than 500 chars, then we would just set a limit on the input and prevent the user from typing more than that. We won't wait until the user clicks the submit button to tell him "Hey, sorry for wasting your time, but you need to shrink your text".

What if the user hacks the JS code and send a thousand chars length message? Well, your backend should always be prepared to handle bogus input, but you shouldn't really bother to return a detailed explanation of all the things that went wrong. A hacker doesn't deserve your time. We can throw an error or an exception.

In case you are building a backend API, you should return a short description about the first thing that failed and use a proper http error code, usually that would be enough for a developer consuming your API to move on.

What if the client side validation doesn't match your backend validation? Then sadly it's not the user's fault if he does something wrong, and there no way we can expect him to fix anything. In this case it's our problem, not theirs. So unit testing both sides is the best way to ensure high reliability.

So enough of talking and let's go from totall anarchy up to a full register form validation with a nice unique username constraint.

**Warming up**

<div id="sample5">
{% highlight js %}
var RegisterForm = React.createClass({
  render: function() {
    return (
      <form>
        <div className="row">
          <label>Account Type</label>
          <select>
            <option value="">-Select a plan-</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div className="row">
          <input placeholder="username" />
        </div>

        <div className="row">
          <input placeholder="password" />
        </div>

        <div className="row">
          <input placeholder="confirm password" />
        </div>

        <div className="row">
          <button type="submit">Register</button>
        </div>
      </form>
      </form>
   );
  }
});

React.render(<RegisterForm />, mountNode);
{% endhighlight %}
</div>

Not really much going on, just mere bootstrap markup. We have a select control to choose an account type; then a username, a password plus a confirm input. We are using divs with a ".row" class for styling purpose only.

If you took a look to this code you will notice it's far from being complete, how we should handle the values? Should this component hold them into its state? To keep our code simple to understand and small, let's prevent our RegisterForm from handling any business logic like sending an ajax request on submit. Let's use props because it makes life easier too.

**Input values and error display**

<div id="sample6">
{% highlight js %}
  var RegisterForm = React.createClass({
  render: function() {
    return (
      <form>
        <div className="row">
          <label>Account Type</label>
          <select defaultValue={this.props.accountType}>
            ...
          </select>
          {this.props.accountTypeError ? <span className="error">{this.props.accountTypeError}</span> : ''}
        </div>

        <div className="row">
          <input defaultValue={this.props.username} ... />
          {this.props.usernameError ? <span className="error">{this.props.usernameError}</span> : ''}
        </div>

        <div className="row">
          <input defaultValue={this.props.password} ... />
        </div>

        <div className="row">
          <input defaultValue={this.props.passwordConfirm} ... />
          {this.props.passwordError ? <span className="error">{this.props.passwordError}</span> : ''}
        </div>
        ...
      </form>
   );
  }
});

React.render(<RegisterForm />, mountNode);
{% endhighlight %}
</div>

As we can see, the values are expected to be passed as props, and we also wrote a handy ternary if statement to show an error message for a given input, preferably we would show one error per input at a time, we don't want to cluter our wonderful UI, also notice the `passwordError` property will work for both password inputs.

Pretty straight forward hey? Since we want to keep the RegisterForm away from any business logic we have wrote around 90% of its final code. Also, writing tests for it would be pretty simple since we would only make assertions about display behaviour.

**Business logic**

<div id="sample7">
{% highlight js %}
var RegisterHandler = React.createClass({
  getInitialState: function() {
    return {
      waiting: false,
      accountType: '',
      accountTypeError: '',
      username: '',
      usernameError: '',
      password: '',
      passwordError: '',
      passwordConfirm: '',
    }
  },

  render: function() {
    return (
      <RegisterForm
        accountType={this.state.accountType}
        accountTypeError={this.state.accountTypeError}
        username={this.state.username}
        usernameError={this.state.usernameError}
        password={this.state.password}
        passwordError={this.state.passwordError}
        passwordConfirm={this.state.passwordConfirm}

        waiting={this.state.waiting}
        inputChangeHandler={this._onInputChange}
        submitHandler={this._onSubmit} />
    );
  },

  _onInputChange: function(property, event) {
  },

  _onSubmit: function(event) {
  }
});

React.render(<RegisterHandler />, mountNode);
{% endhighlight %}
</div>

**getInitialState**: Notice how we are defining all the form properties in the RegisterHandler state. We have also defined a `waiting` property, this will come in handy to lock the form while we are submiting the form, but we haven't prepared our RegisterForm for that scenario yet.

**render**: Besides passing the inputs related data to the RegisterForm we are also passing an `inputChangeHandler` so whenever an input value changes we can fire this action and let the FormHandler  update its state; also check the `submitHandler` which points to `_onSubmit` function, we will handle the ajax request here.

Let's refactor the RegisterForm in order to support the `inputChangeHandler`, `submitHandler` as well as the `waiting` functionality. Since we want ReactJS to take total control over the inputs values we won't use `defaultValue` anymore but `value` instead; this will turn them into controlled components.

<div id="sample8">
{% highlight js %}
var RegisterForm = React.createClass({
  render: function() {
    return (
      <form onSubmit={this.props.submitHandler}>
        {this.props.waiting ? <span>Creating account, please wait...</span> : ''}

        <div className="row">
          ...
          <select
            disabled={this.props.waiting}
            value={this.props.accountType}
            onChange={this.props.inputChangeHandler.bind(null, 'accountType')}>
            ...
          </select>
          ...
        </div>

        <div className="row">
          <input
            disabled={this.props.waiting}
            value={this.props.username}
            onChange={this.props.inputChangeHandler.bind(null, 'username')} ... />
          ...
        </div>

        <div className="row">
          <input
            disabled={this.props.waiting}
            value={this.props.password}
            onChange={this.props.inputChangeHandler.bind(null, 'password')} ... />
        </div>

        <div className="row">
          <input
            disabled={this.props.waiting}
            value={this.props.passwordConfirm}
            onChange={this.props.inputChangeHandler.bind(null, 'passwordConfirm')} ... />
          ...
        </div>

        <div className="row">
          <button disabled={this.props.waiting} type="submit">Register</button>
        </div>
      </form>
    );
  }
});

var RegisterHandler = React.createClass({
  ...

  _onInputChange: function(property, event) {
    var state = this.state;
    state[property] = event.target.value;
    this.setState(state);
  },

  _onSubmit: function(event) {
    event.preventDefault();
    this.setState({waiting: true});
  }
});

React.render(<RegisterHandler />, mountNode);
{% endhighlight %}
</div>


Geez! Seems like a lot of code, but its all boring boilerplate, there is nothing really complex going on. All the inputs register `disabled`, `value` and `onChange` attributes.
At the beginning of the form we toggle a "Creating account, please wait" message depending on the `waiting` value.

In the RegisterHandler we have now implemented the _onInputChange method, notice we only expect the property name that corresponds to the input, and the input event. The _onSubmit method sets `waiting` to true and updates the state, this makes the RegisterForm to lock. We haven't done the ajax request for now, we will do it in one go including the username validation. In the meanwhile let's tackle client side validation.

Since there is no defacto way of handling validation we are left alone with our imagination. We could update the _onSubmit method and do something like:

<div>
{% highlight js %}
_onSubmit: function(event) {
  event.preventDefault();

  if (this._isFormValid()) {
    this._doSubmit();
  }
},

_isFormValid: function() {
  var state = this.state;
  var hasErrors = false;

  if (state.accountType === '') {
    state.acountTypeError = 'please choose an account Type';
    hasErrors = true;
  }

  if (state.userName === '') {
    state.usernameError = 'Please choose a username';
    hasErrors = true;
  }

  // TODO check if passwords are not empty and that they match.

  return hasErrors;
},

_doSubmit: function() {
  this.setState({waiting: true});
  // Ajax request here
}
{% endhighlight %}
</div>


Unless we are planning on building one or two React components in our entire app maybe this could be nearly acceptable, otherwise there are serveral issues with this approach. First, that now we have to write lots of `if` statements. This makes our code harder to read. What if we need to validate another form? Are we going to copy & paste some of these checks?

The right thing to do is to separate our validation logic outside this component so we can reuse it elsewhere, we can also write specific tests for the resulting tool. If we take a look to the Internet there are lots of javascript validation libraries, but most of them will require some DOM manipulation. Since we love clean code we can build a simple validation tool that lives outside our beloved React.

Remember we don't want to go crazy on validation, we don't want the end user to feel frustrated with a form that is winning all the time. We might be ok with a simple `NotBlank`, `MinLength` and `MaxLength` constraints.

But first let's create an abstract layer that will help us to run our custom validation constraints.

<div>
{% highlight js %}
// CONSTRAINT CLASS

function Constraint(errorMessage, check) {
  this.errorMessage = errorMessage;
  this.check = check;
};

Constraint.prototype.validate = function(value) {
  return this.check(value);
}

// CONSTRAINT EXCEPTION CLASS

function ConstraintException(message, name) {
  this.message = message;
  this.name = name || 'ConstraintException';
}

// VALIDATOR CLASS

function Validator(value, constraints, isOptional) {
  this.value = value;
  this.constraints = constraints;
  this.isOptional = isOptional;
  this.errorMessage = '';
  this.isValid = null;
}

Validator.prototype.validate = function() {
  this.errorMessage = '';
  this.isValid = null;

  if (this.isOptional && (this.value === '' || this.value === null || this.value === undefined)) {
    this.isValid = true;
    return;
  }

  for (var i in this.constraints) {
    var constraint = this.constraints[i];

    if (!constraint.validate(this.value)) {
      this.errorMessage = constraint.errorMessage;
      this.isValid = false;
      return;
    }
  }

  this.isValid = true;
};
{% endhighlight %}
</div>

Cool, with this code we have abstracted the validation process, our Validator just expects a value to be passed along with an array of constraints. We also support an 'isOptional' flag, in case we want allow blank values.

How the constraints would look? That's totally up to us, the validator just needs to iterarte throught the constraints and call their `validate()` method, and that it can access an `errorMessage` property.

The ConstraintException will help us to quickly detect where a constraint misuse happened. Now let's see what an implementation would looks like:

<div>
{% highlight js %}
// NOT BLANK

var NotBlank = function(errorMessage) {
  var checker = function(value) {
    value = value.toString();
    return  value.length > 0;
  }

  var defaultErrorMessage = 'This value should not be blank';
  errorMessage = errorMessage || defaultErrorMessage;

  return new Constraint(errorMessage, checker);
}

// MIN LENGTH

var MinLength = function(minLength, errorMessage) {
  minLength = parseInt(minLength, 10);

  if (isNaN(minLength)) {
    throw new ConstraintException('minLength must be a number', 'MinLength');
  }

  var defaultErrorMessage = 'value should be at least ' + minLength.toString() + ' characters long';
  errorMessage = errorMessage || defaultErrorMessage;

  var checker = function(value) {
    value = value.toString();
    return value.length >= minLength;
  };

  return new Constraint(errorMessage, checker);
}

// MAX LENGTH

var MaxLength = function(maxLength, errorMessage) {
  maxLength = parseInt(maxLength, 10);

  if (isNaN(maxLength)) {
    throw new ConstraintException('maxLength must be a number', 'MaxLength');
  }

  var defaultErrorMessage = 'value cannot be more than ' + maxLength.toString() + ' characters';
  errorMessage = errorMessage || defaultErrorMessage;

  var checker = function(value) {
    value = value.toString();
    return value.length <= maxLength;
  };

  return new Constraint(errorMessage, checker);
}

// MATCH

var Match = function(valueToMatch, errorMessage) {
  var defaultErrorMessage = 'values must match';
  errorMessage = errorMessage || defaultErrorMessage;

  var checker = function(value) {
    return value === valueToMatch;
  };

  return new Constraint(errorMessage, checker);
}

// USAGE

var username = 'The Real Slim Shady';
var constraints = [
  new NotBlank('username is required'),
  new MinLength(2, 'username must be 2 characters at least'),
  new MaxLength(10),
];

var usernameValidator = new Validator(username, constraints);

usernameValidator.validate();
console.log(usernameValidator.isValid);
console.log(usernameValidator.errorMessage);
{% endhighlight %}
</div>

Each custom constraint is pretty simple, they do one and only one thing. We don't care if all the constraints fails, we just want to return the error message of the first one that did.

If we ever feel tempted to show more than one error message for a given input, that might be a symptom that our forms are unnecessary complex. Either our target users are pretty skilled with our app (which is rarely the case) or our forms are suffering from bad UX design.

Now that we have some very basic validation abstraction let's use it agains our form component.

<div id="sample9">
{% highlight js %}
...
  _isFormValid: function() {
    var state = this.state;

    var accountTypeValidator = new Validator(state.accountType, [
      new NotBlank('Please choose an account type')
    ]);

    var usernameValidator = new Validator(state.username, [
      new NotBlank('Username is required'),
      new MinLength(4, 'Enter between 4 and 20 characters'),
      new MaxLength(20, 'Enter between 4 and 20 characters')
    ]);

    var passwordValidator = new Validator(state.password, [
      new NotBlank('Password is required'),
      new MinLength(4, 'Enter at least 4 characters'),
      new Match(state.passwordConfirm, 'Passwords must match')
    ]);

    var validators = [
      {propertyPath: 'accountTypeError', validator: accountTypeValidator},
      {propertyPath: 'usernameError', validator: usernameValidator},
      {propertyPath: 'passwordError', validator: passwordValidator}
    ];
    var isValid = true;

    validators.forEach(function(validationMap) {
      var validator = validationMap.validator;
      var propertyPath = validationMap.propertyPath;

      validator.validate();
      state[propertyPath] = validator.errorMessage;

      if (!validator.isValid) {
        isValid = false;
      }
    });

    this.setState(state);

    return isValid;
  },

...
{% endhighlight %}
</div>


















<!--
<a id="conclusion"></a>

### Conclusion [#](#conclusion)

As we have seen there is a lot of boilerplate code to get a simple form fully working, and we haven't covered validation yet. The other side of the coin is that we have the opportunity to handle complex forms with ease, or ask the guys at [HipChat][hipchat].

And yes, polish vodka is the best. Don't belive me? I'll be glad to talk to you about my awesome trip to Poland last year. If you have any questions about vodka or about this post let me know in the comments section below and I'll be happy to help.

@TODO talk about when a component is controlled. If value is provided then there must be an onChange handler. Also if the prop or state is undefined the component is treated as uncontrolled.

-->

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