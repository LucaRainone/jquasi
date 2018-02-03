[![Build Status](https://travis-ci.org/LucaRainone/jquasi.svg?branch=master)](https://travis-ci.org/LucaRainone/jquasi)
[![Coverage Status](https://coveralls.io/repos/github/LucaRainone/jquasi/badge.svg?branch=master)](https://coveralls.io/github/LucaRainone/jquasi?branch=master)

## What
This is a tiny library for interact with DOM in jQuery syntax like

## Why

I love jQuery. But sometimes I need only to do few things
in a chainable|comfortable syntax. Frameworks like Angular, React or Vuejs may be
oversized for a simple page with poor interactivity.

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

## API

The API is a subset of the jQuery API.

- ready: `$(function() {/* document is ready now */})`
- create: `$('<div/>)`
- selectos: `$('.classname[attr="value"])`. This use the `document.querySelectorAll` 
- each: `$('div').each(function() {console.log(this)})`
- (add|remove|toggle|has)Class `$('div').addClass("class-for-all-div")`
- attr: `$('div').attr("data-attr", "value")`
- `.html()`
- append: `$('body').append($('<div/>'))`
- parent: `$('.my-div').parent().parent()`
- remove, clone, empty
- `get()`
- `find()`
- listeners `$('body').on('click',function() {})`
- live listeners: `$('body').on('click','.only-this',function() {})`
- `.fn` as `prototype` shortcut

<strike>`.css()`</strike> is not available because it's hard to do it in
jquery compatibility (it do a lot of things)

This API is a good compromise for lightness and powerfull.

## Contribute
I would to leave this library as tiny as possible and jquery compatible.

Fixes are welcome.

Clone this repo and do:

`npm install`

it will download all what you need for compile and test sources inside `src` folder.

`npm test` for test (using chrome headless)

`npm run-script build` for minify.

For testing in your favourite browser, open the `spec/standalon/SpecRunner.html` file
in it after `npm install`

If you want to add some method, unless it's one-line method, don't add it here
but implement it in your project.

Here some helpful half-compatible implementations
```
$.fn.css = function(attr, value) {
    return this.each(function() { 
        this.style[attr] = value;
    });
}

$('div').css("backgroundColor","red");
```

