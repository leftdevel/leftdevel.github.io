---
layout: post
title:  "Laravel vs Symfony: Sharing data between views"
categories: laravel symfony
tags: [php, laravel, symfony, view composer, render controller, templating]
description: "Sharing data between views: Laravel's view composer vs Symfony's embedded controller." # Add post description (optional)
img: symfony-laravel.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
---

Sharing data between views is something quite common on pages that require similar functionality like having the same header, same footer or display a side bar.

Although there are different scenarios where this functionality is needed today I'll be focusing only in base templates (also called master or layout templates).

As you may already know, a base template is nothing more than the recurrent content between different pages in a website; typically in a web page you'll find:

-  **Header** section: anything that comes before the dynamic content like <html> tag, the <head> tag that contains the title, css imports, meta tags, etc. Also right after the beginning of the <body> tag: hero image, navigation links, log in / log out links, custom menu for logged in users. This is shared between pages.

- **Content** section: where the main content is displayed, the one specific to the given page and that makes it different from other pages. This is unique to the page.

- **Footer** section: the closing section where secondary links are displayed and where you'll usually load your javascript files. This is shared between pages.

Plain html:
{% highlight html %}
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Hello World</title>
        <link rel="stylesheet" type="text/css" href="mystyle.css" />
    </head>
    <body>
        <section id="nav">
            <a href="/home">Home</a>
            <a href="/products">Products</a>
            <a href="/login">Log In</a>
        </section>
        <section id="content">
            Here Goes the dynamic content of each specific page.
        </section>
        <section id="footer">
            <a href="/about">About us</a>
            <a href="/jobs">We are hiring</a>
            <a href="/partners">Our Partners</a>
            <script type="text/javascript" src="/assets/js/site.js">
            </script>
        </section>
    </body>
</html>
{% endhighlight %}

Template engines such as [Twig][twig] and [Blade][blade] - used by Symfony and Laravel respectively - allows you to easily reuse html content.

In order to solve the *header-content-footer* rendering both engines allows us to define a base template containing the shared content, and let dynamic pages to extend from it:

{% highlight html %}
<html>
    <head>
        ...
    </head>
    <body>
        <section id="nav">
            ...
        </section>
        <section id="content">
        {{ "{% block content " }}%}
            Custom content will render here...
        {{ "{% endblock " }}%}
        </section>
        <section id="footer">
            ...
        </section>
    </body>
</html>
{% endhighlight %}

Symfony's child template: products.html.twig
{% highlight html %}
{{ "{% extends 'base.html.twig' " }}%}
{{ "{% block content " }}%}
    This is specific content of the products page.
{{ "{% endblock " }}%}
{% endhighlight %}

Similarly in Laravel, the base would looks like:


[twig]: https://twig.symfony.com/
[blade]: https://laravel.com/docs/5.7/blade