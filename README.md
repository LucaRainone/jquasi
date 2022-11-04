[![Build Status](https://app.travis-ci.com/LucaRainone/jquasi.svg?branch=master)](https://travis-ci.org/LucaRainone/jquasi)
[![Coverage Status](https://coveralls.io/repos/github/LucaRainone/jquasi/badge.svg?branch=master)](https://coveralls.io/github/LucaRainone/jquasi?branch=master)

## What

This is a tiny (4kB minified) and IE9+ compatible library to interact with the DOM using a jQuery-like syntax.

## Why

I love jQuery. But sometimes I only need to do a few things
using a chainable|comfortable syntax. Frameworks like Angular, React or Vuejs may be
oversized for a simple page with little interactivity.

In this case jquasi might help. With this **4kB** library you can do something like this:

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

Of course jquasi is not a complete replacement of jQuery, but
a subset with a compatible syntax/API. So you can start your project with jquasi
and later - if you miss some features -
switch to jQuery without changing anything in your code!

## Repository structure

- The `spec` folder contains tests that work with both jQuery and jquasi.
- The `dist` folder contains the minified version (3k) of jquasi.

## API / supported features

The API is a subset of the jQuery API.

- ready: `$(function() {/* document is ready now */})`
- create: `$('<div/>')`
- selectors: `$('.classname[attr="value"])`. This use the `document.querySelectorAll` 
- each: `$('div').each(function() {console.log(this)})`
- (add|remove|toggle|has)Class `$('div').addClass("class-for-all-div")`
- attr: `$('div').attr("data-attr", "value")`
- `.html()`
- append: `$('body').append($('<div/>'))`
- parent: `$('.my-div').parent().parent()`
- remove, clone, empty
- get: `get()`
- find: `find()`
- listeners `$('body').on('click',function() {})`
- event delegation: `$('body').on('click','.only-this',function() {})`
- remove listeners `$('body').off('click')`
- namespaced events `$('body').on('click.my-custom-namespace')`
- remove namespaced events `$('body').off('.my-custom-namespace')`
- remove all delegated event handlers `$('body').off('click', '**')`
- `.fn` as `prototype` shortcut

From 2.0

- `.html(content)` supports now script tag execution.
- `.attr(name)` returns `undefined` rather than `null` respecting jQuery compatibility
- `.css()` for simple a minimal styling
- removeAttr: `$('div').removeAttr("data-attr")`

This API is a good balance of lightness and power.

## Extending jquasi / adding missing functionalities

If you are missing just a few methods and don't want to switch from jquasi to jQuery, 
you can extend jquasi within your project as shown in this example:

```
$.fn.myMissingFunc = function() {
    // do stuff here
}

$('div').myMissingFunc(/* arguments */);
```

## Contributing

Fixes and contributions are welcome. 

If you wrote an extension in your project and believe it could be of general interest,
feel free to open a Pull Request to discuss its inclusion in the main project.

Consider that this library must remain jquery compatible **and** as small as possible.

### To set up the development environment, clone this repo and run:

`npm install`

to download all dependencies needed for compilation and testing inside the `src` folder.

### To test your changes run:

`npm test` 

to run the tests using chrome headless **OR** open the `spec/standalone/SpecRunner.html` file with your favourite browser.

If you are adding new functionalities, please write the corresponding tests as well.


### To create the minified version of jquasi run:

`npm run build` 
