---
layout: post
title:  "Laravel vs Symfony: Composing views"
categories: laravel symfony
tags: [php, laravel, symfony, layout, templating]
description: "Composing views: Layout inheritance and partial views" # Add post description (optional)
img: symfony-laravel.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
---

TLDR
---
When working on a new website project one of the first tasks is to create a base layout, eventually different pages will extend this layout in order to keep the same look & feel.

Today I'll be comparing how Laravel and Symfony tackles base layout composition. something that brought up my attention is Laravel's - or more specifically Blade's - directives: **yield, section, show, stop** and **parent** for rendering dynamic content. What are their counterparts in Symfony?

Base Template
---
As you may already know, a base template is nothing more than the recurrent content between different pages in a website, it's also referred as master template, sometimes just "Layout"; by the way, the word "template" is usually interchangeable with "view". For consistency from here on I'll call it base template.

Typically a web page has two types of content: the recurrent like a header, footer, sidebar, etc; and the dynamic content, that varies from page to page:

Plain html.
{% highlight html %}
<html>
    <head>
        <title>Hello World</title>
        <link rel="stylesheet" type="text/css" href="mystyle.css" />
    </head>
    <body>
        <section id="sidebar">
            <a href="/home">Home</a>
            <a href="/products">Products</a>
        </section>
        <section id="content">
            Here Goes the dynamic content of each specific page.
            Everything else is recurrent.
        </section>
        <section id="footer">
            <a href="/about">About us</a>
            <a href="/partners">Our Partners</a>
            <script type="text/javascript" src="/assets/js/site.js">
            </script>
        </section>
    </body>
</html>
{% endhighlight %}

Laravel: Blade
---

Template engines such as [Blade][blade]{:target="_blank"} and [Twig][twig]{:target="_blank"} - used by Laravel Symfony and respectively - allows you to easily reuse html content.

In order to solve the *header-content-footer* rendering both engines allows us to define a base template containing the shared content, and let children pages to extend from it:

Laravel's base template: [resources/views/layouts/app.blade.php][laravel_templating]{:target="_blank"}

{% highlight html %}
<html>
    <head>
        <title>@yield('title')</title>
    </head>
    <body>
        @section('sidebar')
            This is the master sidebar.
        @show

        <div class="content">
            @yield('content')
        </div>
    </body>
</html>
{% endhighlight %}

Laravel's child template: [resources/views/child.blade.php][laravel_templating]{:target="_blank"}

{% highlight html %}
@extends('layouts.app')

@section('title', 'Page Title')

@section('sidebar')
    <p>This overrides the master sidebar.</p>
@endsection

@section('content')
    <p>This is my body content.</p>
@endsection
{% endhighlight %}

Once the child template is rendered it will looks like:

{% highlight html %}
<html>
    <head>
        <title>Page Title</title>
    </head>
    <body>
        <p>This overrides the master sidebar.</p>

        <div class="content">
            <p>This is my body content.</p>
        </div>
    </body>
</html>
{% endhighlight %}

As you can see **@section** defines a slot to be filled with content by children templates. The directive **@yield** instructs Blade to render the corresponding section at the position where **@yield** is found.

Easy, isn't it? Now let's look at **@show** which is the closing directive of the leading **@section** directive in the master template. As you may have noticed the child template above also contains a **@section** directive but it is closed by a **@endsection**. So what's the deal here with **@show**?

**@show** is a shorthand of **@stop** (yes, yet another directive that has the same behavior as **@endsection**) followed by a **@yield**:

{% highlight html %}
<!-- This section... -->
 @section('sidebar')
    This is the master sidebar.
@show

<!-- ...is equivalent to -->
@section('sidebar')
    This is the master sidebar.
@stop
@yield('sidebar')
{% endhighlight %}

As we can see Blade won't render a section unless we "yield" it, besides that it will render the content where the yield is found, that means we can define a section at the top of the template but yield it at the bottom.

Another way of closing a section directive is with **@append**, it is similar to **@show** with the added feature that it instructs Blade to append the content defined by chilrend templates to the default content of the parent section:

{% highlight html %}
<!-- base template -->
@section('sidebar')
    This is the master sidebar.
@append

<!-- child template -->
@section('sidebar')
    This is the child content.
@endsection

<!--The result will be -->
this is the master sidebar.
This is the child content.
{% endhighlight %}

But what if you don't always want to append the child's content? You can use the **@parent** directive from the child template and go back using **@show** in the base template:

{% highlight html %}
<!-- base template -->
@section('sidebar')
    This is the master sidebar.
@show

<!-- child template -->
@section('sidebar')
    @parent
    This is the child content.
@endsection

<!--The result will be -->
this is the master sidebar.
This is the child content.
{% endhighlight %}

It may look complicated at first, but once we put it in practice it sinks in. How does Symfony solve these same layout composition issues? Let's compare it back to back.

Symfony: Twig
---

Symfony's base template: [templates/base.html.twig][symfony_templating]{:target="_blank"}

{% highlight html %}
<html>
    <head>
        <title>{{ "{% block title " }}%}{{ "{% endblock " }}%}</title>
    </head>
    <body>
        {{ "{% block sidebar " }}%}
            This is the master sidebar.
        {{ "{% endblock " }}%}

        <div class="content">
            {{ "{% block content " }}%}
            {{ "{% endblock " }}%}
        </div>
    </body>
</html>
{% endhighlight %}

Symfony's child template: [templates/blog/index.html.twig][symfony_templating]{:target="_blank"}

{% highlight html %}
{{ " {% extends 'base.html.twig' "}}%}

{{ "{% block title " }}%}Page Title{{ "{% endblock " }}%}

{{ "{% block sidebar " }}%}
    <p>This overrides the master sidebar.</p>
{{ "{% endblock " }}%}

{{ "{% block content " }}%}
    <p>This is my body content.</p>
{{ "{% endblock " }}%}
{% endhighlight %}

Once the child template is rendered it will looks like:

{% highlight html %}
<html>
    <head>
        <title>Page Title</title>
    </head>
    <body>
        <p>This overrides the master sidebar.</p>

        <div class="content">
            <p>This is my body content.</p>
        </div>
    </body>
</html>
{% endhighlight %}

As you can see, Twig makes use of sections too, but it refers to them as blocks.

Where's **@yield**? Twig doesn't require us to explicitly tell it to render a given section. Wherever it finds a **block** directive it will render its content just right there. If a child template defines a block that also exists in the base template, twig will override the parent's block with the content defined in the child template just like in the previous example in the sidebar block.

But what if don't want to override a block's default content defined in the base layout but to append? Like in Blade, Twig allow us to reference the parent block's content via a pretty much similar directive **parent()**:

{% highlight html %}
<!-- base template -->
{{ "{% block sidebar " }}%}
    This is the master sidebar.
{{ "{% endblock " }}%}

<!-- child template -->
{{ "{% block sidebar " }}%}
    {{ "{{ parent() " }}}}
    This is the child content.
{{ "{% endblock " }}%}

<!--The result will be -->
this is the master sidebar.
This is the child content.
{% endhighlight %}

Unlike Blade, Twig doesn't have an **@append** directive. This means if you want to always append the child section's content to the parent's section you'll have to remember to add **{{ "{{ parent() " }}}}** to every child template.

Final Notes
---

My take is that Laravel offers us more flexibility at the expense of having to learn and remember more directives than Symfony.

**@yield** seems useful if you want to render a given section at a different position in the layout. Also if you have a section and don't want to render it then you omit it. Also, **@append** seems useful if you always want to append content to the base sections.

But honestly I've never found myself in a situation needing these features. Twig seems simpler to me. In any case this is just my personal preference.

Which one you prefer? Did I miss something? Let me know in the comments.

References
---
- [https://symfony.com/doc/current/templating.html#template-inheritance-and-layouts][symfony_templating]
- [https://laravel.com/docs/5.7/blade#template-inheritance][laravel_templating]
- [https://stackoverflow.com/questions/50530267/laravel-blade-stop-vs-show-vs-endsection-vs-append][stack_overflow]

[twig]: https://twig.symfony.com/
[blade]: https://laravel.com/docs/5.7/blade
[laravel_templating]: https://laravel.com/docs/5.7/blade#template-inheritance
[symfony_templating]: https://symfony.com/doc/current/templating.html#template-inheritance-and-layouts
[stack_overflow]: [https://stackoverflow.com/questions/50530267/laravel-blade-stop-vs-show-vs-endsection-vs-append]