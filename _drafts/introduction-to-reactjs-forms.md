---
layout: post
title:  "Introduction to ReactJS forms"
date:   2015-03-27 15:20:00
categories: reactjs state forms
---
Application state vs UI state. Controlled vs uncontrolled components. Abstracting & reusing widgets. Give your forms that shot of steroids right from the begining; free of guilt.

You can easily find yourself having a hard time with forms right from the begining. Did you know you can even design forms in three different ways? Yay! Isn't that awesome?

...No, wait, nooo. That's actually terrible, our goal must be to solve a problem (or group of problems) in a consistent way. ReactJS is not inmune to spaghetti code but thankfully it's brilliantly designed so the amount of options for screwing the pooch are at minimum.

<a id="coupon-app"></a>

### Coupon App [#](#coupon-app)

We will build a very simple coupon app with a few requirements: We enter a promo code, we hit submit, the form hides, we show a success message with a link to switch back to the submit form. Let's see the template with the minimum amount of code possible.

<div id="sample1">
{% highlight js %}
/* Snippet 1 */
var Coupon = React.createClass({
  render: function() {
    if (!this.props.isApplied) {
      return this.getFormNode();
    } else {
      return this.getSuccessNode();
    }
  },
  getFormNode: function() {
    return (
      <form>
        <label>Enter Promo Code</label>
        <input type="text" />
        <button>Apply</button>
      </form>
    );
  },
  getSuccessNode: function() {
    return (
      <div>
        The discount has been applied!
        <a href="#">Apply Again</a>
      </div>
    );
  }
});

React.render(<Coupon isApplied={false} />, mountNode);
{% endhighlight %}
</div>

As we can see, there is not much fun going on. We rely on `isApplied` property to toggle between the views.

<a id="state-overdose"></a>

### State Overdose [#](#state-overdose)

In a real world scenario we would also like to submit the form to a backend server, notify the user know we are processing the request, and disable the form to avoid a re-submit. Not really hard, is it? We can throw all the important info into the component's state, hold my beer:

<div id="sample2">
{% highlight js %}
/* Snippet 2 */
var Coupon = React.createClass({
  getInitialState: function() {
    return {
      isApplied: this.props.initialIsApplied,
      isWaiting: false,
      promoCode: '',
    };
  },

  render: function() {
    if (!this.state.isApplied) {
      return this.getFormNode();
    } else {
      return this.getSuccessNode();
    }
  },

  getFormNode: function() {
    var wait = this.state.isWaiting ? 'Verifying code. Please wait...' : '';

    return (
      <form>
        {wait}
        <label>Enter Promo Code</label>

        <input
          type="text"
          onChange={this._onPromoCodeChange}
          value={this.state.promoCode}
          disabled={this.state.isWaiting}
        />

        <button disabled={this.state.isWaiting} onClick={this._apply}>Apply</button>
      </form>
    );
  },

  _onPromoCodeChange: function(event) {
     this.setState({promoCode: event.target.value});
  },

  _apply: function(event) {
    event.preventDefault();
    this.setState({isWaiting: true});

    // Mocking the server verification response
    setTimeout(function() {
      this.setState({isWaiting: false, isApplied: true});
    }.bind(this), 2000);
  },

  getSuccessNode: function() {
    return (
      <div>
        The discount has been applied!
        <a href="#" onClick={this._applyAgain}>Apply Again</a>
      </div>
    );
  },

  _applyAgain: function(event) {
    event.preventDefault();
    this.setState({promoCode: '', isApplied: false});
  }
});

var initialIsApplied = false; // we could pull this info from the backend.

React.render(<Coupon initialIsApplied={initialIsApplied} />, mountNode);
{% endhighlight %}
</div>

Althought we now have around 70 lines of code, most of it is pretty simple. The `render` method was left unchanged; for the new code let's review what's happening.

**getInitialState**: Notice `this.props.initialIsApplied`, we named it this way because it's only needed for initialization, for example we could get this value from the backend instead, in case we are persisting the user's latest redeemed coupon.

**getFormNode**: A "Please wait..." message will be displayed while an -hypothetical- ajax request is being processed, the input and the button will be disabled during that period. Notice that the input value is now managed by React, it means it will get its value from the component's state, this is what we call a [controlled component][controlled_component]. An input is "controlled" whenever we register its `value={..}`, and the only way to update that value is by updating the state (check `_onPromoCodeChange()` method).

It's imporant to emphatise that - the state is the source of the input's value - and not the other way around, of course we are relying on an `event` to listen for every input change, but the input wouldn't reflect those changes without the state being updated. Comment out the `onChange` code and you will see what I mean. This strategy ensures that the the input's value reflects the state at any point in time.

If you checked the previous link, you'll have read that controlled components are useful for when we want real-time validation and other features (like autocomple, or date formatting). But we have no plans to do anything fancy with the input's value. An issue with controlled components is that usually we'll need to register an `onChange(event)` method forcing us to add more lines of code. Without any tangible benefit it quickly becomes pure noise. We will fix this later.

**_apply**: This function is called when the submit button is clicked. `isWaiting` is immediately set to true in order to give visual feedback to the user, it also disables to form in order to avoid a potential re-submit while the request is still in progress. Then we fire an hypothetical ajax request, but we mock that functionality with a timeout function that will set `isApplied` to true, triggering the success view to toggle.

The rest is self explanatory. As you can see, we are making heavy use of the component's state. We said that controlled components add complexity to our application, and without any real benefit we should avoid it. So far we have a good example of _state overdose_. I can clearly see the component trippin' away.

<a id="ghost-component"></a>

### Ghost Component [#](#ghost-component)

The opposite to solely rely on state is obviously to solely rely on props. This new design would also make more sense because in most cases we will have a root component managing a global state. Let's create a parent component for our component.

<div id="sample3">
{% highlight js %}
/* Snippet 3 */
var App = React.createClass({
  getInitialState: function() {
    return {
      user: {name: 'John Doe'},
      coupon: {
        isApplied: false,
        isWaiting: false,
        promoCode: '',
      }
    };
  },

  render: function() {
    return (
      <div>
        <div>
          Welcome <strong>{this.state.user.name}.</strong>
        </div>
        <Coupon coupon={this.state.coupon} />
      </div>
    );
  }
});

React.render(<App />, mountNode);
{% endhighlight %}
</div>

**getInitialState**: As you can see, we have moved the coupon data to the App component state, and it's now being passed to the Coupon component as a prop in the render method.

Note: We haven't updated Coupon yet but the Demo still works because Coupon doesn't have external dependencies; by not supplying a value for `initialIsApplied` the component will cast any reference to it to false.

Let's refactor our Coupon to make it fully abstract. Also notice how we turn the input to an [uncontrolled component][uncontrolled_component] by not registering a `value` atrribute but a `defaultValue` instead.

<div id="sample4">
</div>

{% include js.html %}

[controlled_component]: https://facebook.github.io/react/docs/forms.html#controlled-components
[uncontrolled_component]: https://facebook.github.io/react/docs/forms.html#uncontrolled-components

<!--- @TODO
   * input value vs input's value
   * Reconcile isApplied, should it be hardcoded or come from a prop?
-->