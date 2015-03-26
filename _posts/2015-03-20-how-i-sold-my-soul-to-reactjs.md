---
layout: post
title:  "How I sold my soul to ReactJS"
date:   2015-03-20 15:20:00
categories: reactjs introduction
---
This is a quick introduction about my experience with ReactJS. I won't showcase any code today, however I believe it's worth reading, especially if you are unsure about giving ReactJS a go. Let's get started.

If you are like me, you've probably considered selling your soul many times. Due to the global economic crisis you should either keep it or try to sell it soon. If you choose the later, I'll tell you how I sold mine to ReactJS.

> ...Angular, a popular JS framework from Google, isn't used on Google's flagship client-side applications (Google+, Gmail, and Docs use Closure). Few other libraries or frameworks besides jQuery and Closure have been as battle-tested as React. ([Pete Hunt][quora])

What a mind blowing quote. Of course Facebook is also using PHP for their backend but that doesn't mean PHP is the best programing language ever. However, there is a clear difference between using whatever tool I like and keeping my mouth closed vs promoting a tool I hardly use. It's like preaching a christian god to my neighbors, but praying to a hindu one at home.

What if I told you that you're likely to have experienced ReactJS already without writing a single line of code? If you have a Facebook account and you've used any comment thread since 2011 then you did. Isn't it nice how destiny is working ony you?

<a id="advantages"></a>

### Advantages [#](#advantages)

* It has been battle tested.

* It does one thing, and it does it very well, which is taking care of the view layer. ReactJS is the "V" in "MVC".

* Its [lifecycles][lifecylces] are really simple. You can listent to events for mounting and updating the component, as well as when receving new data.

* Performance is just insane. It uses a diff/patch algorithm to compute the most efficient way to update the DOM with the help of a corresponding [virtual DOM][virtual_dom]. Anything faster would be over-engineering.

* Its one-way data binding makes it easier to reason about _when_ and _how_ the DOM will mutate, there's also no magic involved. _Cough cough_, I'm looking at you, two-way data binding.

* Nesting components is quite easy. You're actually expected to nest and combine lots of components, otherwise it's like going to McDonald's for a salad. (Yes, I stole that joke).

* Server side rendering is a reality if you have a javascript-aware backend server. Google spiders will thank you.

* There is an [initiative][react_mobile] to make ReactJS components to render to native mobile. I can't think of anything better for reusing code across platforms than this, it will be the next major revolution after Fidel Castro's.

* Scaling an app to the moon becomes straight forward once you gain experience with [Flux][flux]. Scaling is one of the major issues with current JS frameworks/libraries due to code maintenance and performance.

I won't go deep into those points since they have been thorougly discussed elsewhere. But I'll stop for a moment on...

<a id="scaling"></a>

### Scaling [#](#scaling)

It doesn't really matter what tools or the amount of them you use, if you can scale with little or no pain at all then you won at life.
When fully leveraging ReactJS, the heavy lifting happens at the very beginning when setting up the Flux structure (stores, actions, constants, registering listeners, formatting data, wiring http resources, etc). Once you get this sorted out you can throw as many features as you want with confidence that nothing will break out of blue, and that performance will likely stay the same.

For the sake of having something to compare ReactJS with let's pick AngularJS since I've use it to build toy applications. I spent a good amount of time reading and learning, and I loved it. But the butterflies in my stomach didn't last for too long because its way of doing things. It's not a big deal, yet it bugs me everytime:

* Nesting directives can be problematic due to scopes.

* The entire DOM has to be traversed on `page load` in search for DSL code (AngularJS code embedded in html tags). Afterwards, it will remove the bootstrap markup, then run it and then replace the initial markup with the compiled result.

* You have to keep an eye on digest cyles, otherwise you can compromise the app performance.

The first point is about maintenance, the others are performance related, and they all will be patiently waiting for the right moment to get in your way. ReactJS doesn't really suffer from any of those gotchas. Even though ReactJS will traverse the entire DOM, it is only to look for where to mount your components. The number of mounting nodes are quite limited in practice, and it's not even close to what happens on AngularJS initial run. However AngularJS has some neat features like services, filters, routing, http agent, form validation and everything you need to start prototyping in no time.

Anyway, this post isn't about ReactJS vs AngularJS, and most of those AngularJS gotchas have workarounds.

In my opinion, the key factor to choose ReactJS over most JS frameworks/libs out there is its power to scale, forget about people claiming it's easier to learn than the competitors, it certainly is in a narrow scope but you will find out it's equally challenging once you have to do production-ready SPAs; you will have to learn how the Flux architecture works in order to avoid polluting components with business logic, and that will add up difficulty to the whole learning process. However it will eventually get easy to reason about once you've spent a couple of days with it. Remember, nothing that is too easy to learn and implement will scale well (think of jQuery). Also things don't have to be more complicated than needed (think of [Java Server Faces][JSF]). I find in ReactJS & Flux a well balanced investment with a solid return rate. Don't take my word only, a lot of popular [companies][companies] are making the switch.

<a id="reactjs-isnot-all-about"></a>

### Even ReactJS isn't all about rainbows and unicorns. [#](#reactjs-isnot-all-about)

The AngularJS and EmberJS team recently announced they will be implementing a virtual DOM in the future. In fact, this technique is nothing that cannot be implemented elsewhere. So we, the advocates, won't be bragging about its performance for too long.

Also, before you decide to sell your soul to ReactJS you must be aware of the bad and ugly things, those nobody likes to talk about:

* You'll need to compile your JSX code to valid JS syntax. Want it or not, without it plain ReactJS code is quite [cumbersome][jsx_vs_plain]. You either include the on-the-fly JSX transformer script or use the npm react-tools package and compile your code from a terminal or within a build task (gulp with browserify, or webpack).

* Deeply nested components can get ugly to manage if you don't make use of Flux. It means you will either end learning Flux or not using ReactJS at all, because if you intend to do really simple stuff there is a good chance that you can achieve the same functionality with what you already have in your toolset.

* Getting your head around about when to use `props` vs `state` can be confusing at the beginning and lead you to write complicated code. I used to get confused, and a good number of people still get confused. I'll post about best practices next time.

* There is no built-in http agent. You will need to search, compare, and choose one. I use [superagent][superagent], btw.

* There is no built-in nor official routing system. You'll need to use something like [React Router][react_router]. Not that there's something wrong about it, but it doesn't give me _that_ blind confidence that I'm used to.

* There is no built-in form validation. You will need to find a third party library to help you with it, unless you keep your forms logic very simple.

* Although rendering a component on the server is trivial, you are pretty limited to simple components. Trying to render a Flux application becomes near impossible unless you manage to sync and transfer the server app state to the client app state somehow.

If you see it from a different perspective though, those things that ReactJS lacks of can be an advantage too. It means its core stays compact and it will try its best to do one and only one thing which is handling the view efficiently.

<a id="conclusion"></a>

### Conclusion [#](#conclusion)

I'll bet my piggy bank on ReactJS and stick with it because it's easy to reason about, there is no magic going under the hood, easy to debug, test, maintain and scale.


[quora]:        http://www.quora.com/Pete-Hunt/Posts/React-Convincing-the-Boss
[lifecylces]:   http://facebook.github.io/react/docs/component-specs.html#lifecycle-methods
[virtual_dom]:  http://stackoverflow.com/questions/21109361/why-is-reacts-concept-of-virtual-dom-said-to-be-more-performant-than-dirty-mode
[react_mobile]: https://news.ycombinator.com/item?id=8961551
[flux]:         http://facebook.github.io/flux/docs/overview.html#content
[superagent]:   http://visionmedia.github.io/superagent/
[jsx_vs_plain]: http://facebook.github.io/react/docs/jsx-in-depth.html
[react_router]: https://github.com/rackt/react-router
[companies]:    https://github.com/facebook/react/wiki/Sites-Using-React
[JSF]:          http://www.mkyong.com/tutorials/jsf-2-0-tutorials/