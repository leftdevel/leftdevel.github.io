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

We will build a very simple login form with a few requirements: We enter a username and password, we hit submit, the form hides, we show a success message with a link to logout, which shows the login form again.

<div id="sample1">
{% highlight js %}
/* Snippet 1 */
var LogInForm = React.createClass({
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
        Hey John Doe, welcome on board!
        <a href="#">Log Out</a>
      </div>
    );
  },
  render: function() {
      return this.getLogInNode();
  }
});
{% endhighlight %}
</div>

Mark heard we know we love ReactJS, he also tell us all Facebook engineers are busy working on Relay and GraphQL. He want us to do a simple job, to let people to edit a comment with the less amount of effort.

{% include js.html %}