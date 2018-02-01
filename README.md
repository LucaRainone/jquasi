[![Build Status](https://travis-ci.org/LucaRainone/jquasi.svg?branch=master)](https://travis-ci.org/LucaRainone/jquasi)

## What
This is a tiny library for interact with DOM in jQuery syntax like

## Why

I loved jQuery. Recent frameworks like React, Vuejs, Angularjs
and so on, are nice and very performant. Vuejs, in its semplicity
is another planet.

But sometimes we need just a simple click listener, 
or create fews elements dinamically or do a document.ready.
We don't need a framework for this, or a superhero
library like jQuery. 
Yes. There are beautiful sites like http://youmightnotneedjquery.com/
that help us a lot.

But jQuery has a very lovable syntax:
chained methods, multiple HtmlElement managment, toggle class.

It's sad to leave all this if we don't want to load 80kb
of library for few line of codes.

Here jquasi might help us. You can do something like this:


```

$(function() {
    $('body').append(
        $('<a/>')
            .attr("href","#")
            .html("Simple link")
            .on('click', function(e) {
                $(this)
                    .toggleClass('a-clicked')
                    .html("clicked!");
                return false;
            })
    );
});

```
with this 3kb library.

Of course there are a lot of limitations: if you need to do
something of complex without worry
about them, then it's better to don't leave jQuery
(and maybe to learn Vuejs or React :)). 

The fine part is that you can start your project with jquasi
and only if you understand that you need something of more complex,
you can switch to jquery without change anything of your code.

The `spec` folder contains test that run both with jquery and jquasi.

## Where

In `dist` folder you have the minified version (3k).

