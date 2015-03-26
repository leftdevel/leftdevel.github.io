---
layout: post
title:  "ReactJS Props vs State Best Practices"
date:   2015-03-25 04:20:00
categories: reactjs tutorial props state best practices
---
Misusing props & state is a guaranteed bomb of bugs that will cost you a lot of time to fix. In an app with few hundreds of lines of code the danger is not that visible, but once your  project grows the issues and headaches will strike all at once.

You will start seeing things behaving in unexpected ways, errors will become hard to reproduce. Funnily enough ReactJS's purpose is to rescue us from all those issues that we suffered with other JS libraries.

When I started learning ReactJS the first thing that made me scratch my head was deciding between passing data to a component via its props, or making the component to read what it needed from a data source and store it in its state. I underestimated the potential issues of not using them properly.

<a id="a-simple-example"></a>

### A Simple Example [#](#a-simple-example)

We'll see why it's so easy to get confused. The following snippet is a slight modification of the first example in the ReactJS [landing page][landing_page],
but instead of a HelloMessage component we will use a Counter:

{% highlight js %}
/* Snippet 1 */
var Counter = React.createClass({
  render: function() {
    return <span>Count is {this.props.count}</span>;
  }
});

React.render(<Counter count={5} />, mountNode);
{% endhighlight %}

Quite easy, right? What about if we do the same but using state instead:

{% highlight js %}
/* Snippet 2 */
var items = ['item1', 'item2', 'item3'];

var Counter = React.createClass({
  getInitialState: function() {
    return {count: items.length};
  },

  render: function() {
    return <span>Count is {this.state.count}</span>;
  }
});

React.render(<Counter />, mountNode);
{% endhighlight %}

Which one is the evil twin? Which one will peck out your eyes once your project gets bigger? In practice, both are correct and wrong depending on the context they are being used. Bear with me during the next ten minutes and I'll try my best to explain why.

I believe the confusion occurs because oversimplification. I won't blame it on the ReactJS examples, they are a really good starting point. But without any surrounding context it's pretty hard to tell which one we should use. The first and obvious thing to do is to ask ourselves what will be the purpose of Counter. Are we going to use it to display the number of impressions for a tweet, or a message counter in a navbar like Facebook does?

<a id="tweet-list-component"></a>

### TweetList Component [#](#tweet-list-component)

We'll build a TweetList component and a tweet impressions Counter little by little, so we can see why and when to use props & state. Let's justify the need for a Counter component by saying we want it to spell out the number of impressions, so for instance if we pass '1' it will display 'one', and so on.
Our first attempt will be to build our components without the help of props nor state.

{% highlight js linenos %}
/* Snippet 3 */
var _tweet = {
  author: 'John',
  content: 'My first ReactJS tweet',
  impressions: 5
};

var Counter = React.createClass({
  render: function() {
    var wordsDataSet = ['zero', 'one', 'two', 'three', 'four', 'five'];
    var word = wordsDataSet[_tweet.impressions];

    return (
      <span>Impressions: {word}</span>
    );
  }
});

var TweetItem = React.createClass({
  render: function() {
    return (
    <div>
      <div>@{_tweet.author} says:</div>
      <div>{_tweet.content}</div>
      <Counter />
    </div>
    );
  }
});
{% endhighlight %}

While this snippet of code is - hopefully - easy to read, you might have spotted a couple of horrible
flaws. Can you smell it? It's roquefort.

Flaw number one, and probably the worst, is that now our fancy and useful Counter has been relegated
to be used within a tweet context, and can't be used for anything else. See how line 11 has hammered the last
nail in our coffin by making our wonderful Counter to depend on a `_tweet` object. Also line 14 has "Impressions:" label hardcoded.

Let's define some features that our Counter should have:

* Agnostic about the count context (it can be used for tweet impressions, retweets, number of followers, etc).
* Should not care about how to get its data (if it comes from a javascript object, an html property, an ajax call, etc).
* Should be easy to plug into complex components at any level of the hierarchy tree.

The Flux architecture recommend us that only the outermost component in a hierarchy of components (called controller-view component) should handle a state, and pass it down to its children components through their props. This makes it easy to reason about where and when the view mutates. Whenever the state changes the controller-view component will re-run its render function, its children will receive the new props and will update accordingly in a domino effect.
 With those features in mind and that recommendation from above we conclude the Counter will hardly be used standalone, but within other components as a helper. In consequence it shouldn't handle any state but rely entirely on its props. So Let's refactor our code.
{% highlight js %}
/* Snippet 4 */
// ...
var Counter = React.createClass({
  render: function() {
    var wordsDataSet = ['zero', 'one', 'two', 'three', 'four', 'five'];
    var word = wordsDataSet[this.props.count];

    return (
      <span>{word}</span>
    );
  }
});

var TweetItem = React.createClass({
  getInitialState: function() {
    return {tweet: _tweet};
  },

  render: function() {
    return (
      <div>
        <div>@{_tweet.author} says:</div>
        <div>{_tweet.content}</div>
        Impressions:
        <Counter count={_tweet.impressions} />
      </div>
    );
  }
});
{% endhighlight %}

Our Counter looks better now, and since the TweetItem is the outermost component, it will be the one in charge to handle the state. But we still have one issue left. The TweetItem is unlikely to be used standalone. We'll use it in the context of a tweet list, so it shouldn't handle state either. Let's fix this by refactoring TweetItem and creating TweetList.

{% highlight js %}
/* Snippet 5 */
// ...

var TweetItem = React.createClass({
  render: function() {
    return (
      <div>
        <div>@{this.props.tweet.author} says:</div>
        <div>{this.props.tweet.content}</div>
        Impressions:
        <Counter count={this.props.tweet.impressions} />
      </div>
    );
  }
});

var TweetList = React.createClass({
  getInitialState: function() {
    return {tweets: []};
  },

  componentDidMount: function() {
    var self = this;
    $.get('/latest-tweets.json', function(_tweets) {
      self.setState({tweets: _tweets});
    });
  },

  render: function() {
    var listItems = this.state.tweets.map(function(tweet, index) {
      return (
        <li key={index}>
          <TweetItem tweet={tweet} />
        </li>
      );
    });

    return (
      <ul>
        {listItems}
      </ul>
    );
  }
});
{% endhighlight %}

It's looking much better now. The outermost component - TweetList - is handling the application state. In the `componentDidMount` method
we are telling it to execute a jQuery ajax request to fetch the latest tweets and update its state on the request callback.

Tip: Although technically there's nothing wrong about executing an ajax request within the TweetList component, it's better to move business logic elsewhere, e.g. stores. But let's keep it this way for brevity.

<a id="unread-messages-count-component"></a>

### UnreadMessagesCount Component [#](#unread-messages-count-component)

Remember I said both versions of Counter were right or wrong depending on the context? We already built a Counter that relies solely on props, let's see when it would make sense to use state.

Imagine we are not working with tweets anymore but with messages instead and we have a MessageList component. We want it to render almost the same structure as TweetList but without impressions count. Let's define its features:

* We only care about counting unread messages, nothing else. We will have only one counter in the whole app.
* It should update itself whenever a new unread message is created.
* It should work standalone wherever it is placed. For better usability we will display it in the page header like Facebook does, this means our MessageList and Counter will live separated from each other.

Our wonderful html layout would looks like this.

{% highlight html %}
<body>
  <header>
      <span id="counter-mount-node"></span>
  </header>
  <main>
      <span id="message-list-mount-node"></span>
  </main>
</body>
{% endhighlight %}

As you can see, the Counter will be a controller-view by itself since it is the outermost component. We won't reuse it either, and its code will be pretty straight forward. I can already see the Bat-Signal telling us there is no other way, we must use state.

{% highlight js %}
var UnreadMessagesCounter = React.createClass({
  getInitialState: function() {
    return {count: 0};
  },

  componentDidMount: function() {
    messageStore.addChangeListener(this.onMessagesChanged);
  },

  onMessagesChanged: function() {
      var count = messageStore.getUnreadMessagesCount();
      this.setState({count: count});
  },

  render: function() {
    return (
      <span>You have {this.state.count} unread messages</span>
    );
  }
});

var mountNode = document.getElementById("counter-mount-node");
React.render(<UnreadMessagesCounter />, mountNode);

$(document).ready(function() {
    messageStore.loadMessagesAndEmitChange();
    setInterval(messageStore.loadMessagesAndEmitChange, 5000);
});

{% endhighlight %}

Hopefully the code is easy to understand. The component is pretty straight forward. We have no business logic
in it, we leave that for an hypothetical messageStore. This how the store would work:

* It is the only channel for retrieving the list of messages (single source of truth).
* It let components to subscribe to any messages update event, so they can pull the latest list. This will be possible by registering a callback to its `addChangeListener` method.
* Its method `loadMessagesAndEmitChange` will be executed every 5 seconds after the page has loaded.

For instance MessageList would also subscribe to messageStore to listen for changes. But I won't waste your time by going through the MessageList component code since it's practically the same as TweetList. I'll omit the store code to avoid straying away from the main topic. But don't worry, I'll pay my debt to you in an upcoming post with a more robust approach for stores.

<a id="conclusion"></a>

### Conclusion [#](#conclusion)

What we learned so far might not be _that_ useful for you unless you are new to ReactJS. I'll make it more intersting by showcasing a Twitter clone in a later stage. Upcoming posts will introduce other topics that will be the foundation for the final tutorial. If you are finding issues to run the snippets let me know in the comments and I'll be glad to help you out.

[landing_page]: http://facebook.github.io/react/index.html