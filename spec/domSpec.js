define(['jquery','jquasi'], function(jquery, jquasi) {
    _test(jquasi, jquery);
    _test(jquery, jquery);
});

function _test ($,jquery) {

    function click(el) {
        var ev = document.createEvent("MouseEvent");
        ev.initMouseEvent(
            "click",
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        el.dispatchEvent(ev);
    }

    describe("Check for base works", function () {
        $('body').append($('<div/>').attr("id","test_container"));
        it("should be defined and create a div with a id", function () {
            $('#myelement').remove();
            var $body = $('#test_container');
            document.body.appendChild($body[0])
            $body.append($('<div/>').attr("id", "myelement"));

            expect(document.getElementById("myelement")).not.toBeNull();
            expect(document.getElementById("myelement").outerHTML).toBe("<div id=\"myelement\"></div>");


            $body.append($('<div/>').addClass("an-el")[0]);
            expect($body.find('.an-el').length).toBe(1);
        });

        it("remove element shoud works", function () {
            $('#myelement').remove();
            expect(document.getElementById("myelement")).toBeNull();
        });
    });

    describe("Check methods", function () {

        beforeEach(function () {
            $('#test_container').remove();
            $('body').append($('<div/>').attr("id","test_container"));
            var $body = $('#test_container');
            $body.find("div").remove();
            $('#myelement').remove();
            $body.append($('<div/>').attr("id", "myelement"));
        });

        it("constructor works", function () {
            var $el = $('#myelement');
            var orgElement = document.getElementById("myelement");
            expect($el.length).toBe(1);
            expect($el).toBe($el);

            // jquery clone the original object, is not the object itself
            expect($($el)).not.toBe($el);

            expect($($el)[0]).toBe($el[0]);
            expect($el[0]).toBe(orgElement);
            expect($(orgElement)[0]).toBe(orgElement);
            expect($(document.body)[0]).toBe(document.body);

            expect($(jquery(document.body))[0]).toBe(document.body);

        });

        it("document ready should works", function(done) {
            var listener = jasmine.createSpy();

            $(function() {
                listener();
            });
            jquery(function() {
                setTimeout(function() {expect(listener).toHaveBeenCalled();done()},50)
            })

        });

        it("listeners works", function (done) {
            var $el = $('#myelement');
            var listener = jasmine.createSpy().and.callFake(function () {
                expect(this).toBe($el[0]);
                done();
            });
            expect($el.on('click', listener)).toBe($el);
            click(document.getElementById("myelement"));
            expect(listener).toHaveBeenCalled();
        });

        it("live listeners works", function (done) {
            var listener = jasmine.createSpy().and.callFake(function () {
                expect(this).toBe(document.getElementById("myelement"));
                done();
            });
            var $body = $('#test_container');
            expect($body.on('click','#myelement', listener)).toBe($body);
            click(document.getElementById("myelement"));
            expect(listener).toHaveBeenCalled();
        });

        it("live listeners do not fire on root element", function (done) {
            var listener = jasmine.createSpy().and.callFake(function () {
                done();
            });
            var $body = $('#test_container');
            expect($body.on('click','#myelement', listener)).toBe($body);
            click(document.getElementById("test_container"));
            expect(listener).not.toHaveBeenCalled();
            setTimeout(function() {done()},200);
        });

        it("live listeners do not fire on any other element", function (done) {
            var listener = jasmine.createSpy().and.callFake(function () {
                done();
            });
            var $body = $('#test_container');
            var $other = $('<div/>').attr("id","other_el");
            $body.append($other);
            expect($body.on('click','#myelement', listener)).toBe($body);
            click($other[0]);
            expect(listener).not.toHaveBeenCalled();
            setTimeout(function() {done()},200);
        });

        it("class methods works", function () {
            var $el = $('#myelement');

            expect($el.addClass("myClass")).toBe($el);
            expect($el[0].className).toBe("myClass");

            expect($el.removeClass("myClass")).toBe($el);
            expect($el[0].className).toBe("");

            expect($el.toggleClass("myClass")).toBe($el);
            expect($el[0].className).toBe("myClass");
            expect($el.hasClass("myClass")).toBeTruthy();
            $el.toggleClass("myClass");
            expect($el[0].className).toBe("");
            expect($el.hasClass("myClass")).toBeFalsy();

            expect($('#not-existent-element').hasClass("not-class")).toBeFalsy();

            $el.addClass("class1").addClass("class2").removeClass("class1");
            expect($el[0].className).toBe("class2");
            $el.removeClass("class2");
            expect($el[0].className).toBe("");

        });

        it("html and empty works", function() {
            var $el = $('#myelement');

            expect($el.html("Hello World")).toBe($el);

            expect($el[0].innerHTML).toBe("Hello World");

            $el.html("<p>Hello World</p>");
            expect($el[0].innerHTML).toBe("<p>Hello World</p>");
            expect($el.html()).toBe("<p>Hello World</p>");

            expect($el.empty()).toBe($el);
            expect($el.html()).toBe("");
        });

        it("parent() should works", function() {
            var $el = $('#myelement');
            var $parent = $el.parent();
            expect($parent instanceof $).toBeTruthy();
            expect($parent.length).toBe(1);
            expect($parent[0]).toBe(document.getElementById("test_container"));

            var $newDiv = $('<div/>');
            $el.append($newDiv);
            var $parentEl = $newDiv.parent();
            expect($parentEl[0]).toBe($el[0]);

            expect($newDiv.parent().parent()[0]).toBe(document.getElementById("test_container"))

        });

        it("set and get attributes should work", function() {
            var $el = $('#myelement');

            $el.attr("data-myattr", "myvalue");

            expect($el.attr('data-myattr')).toBe("myvalue");

        });


        it("clone should works", function() {
            var $el = $('#myelement');
            $el.addClass("another-class");
            var $clone = $el.clone();
            expect($clone).not.toBe($el);
            expect($clone.hasClass("another-class")).toBeTruthy();
        });

        it("stopPropagation should works", function(done) {
            var $el =$('#myelement');
            var listener = jasmine.createSpy().and.callFake(function () {
                done();
            });
            $el.on('click', function(e) {
                e.stopPropagation();
            });
            document.body.addEventListener('click', listener);
            expect(listener).not.toHaveBeenCalled();
            setTimeout(function() {
                done();
            },100);
        });

        it("get() works", function() {
            var $el = $('#myelement');
            expect($el.get(0)).toBe($el[0]);
            expect($el.get(-1)).toBe($el[0]);

            var $body = $('#test_container');
            $body.append($('<div/>').addClass("get-class"));
            $body.append($('<div/>').addClass("get-class"));
            var $target = $('<div/>').addClass("get-class");
            $body.append($target);

            expect($body.find('.get-class').get(-1)).toBe($target[0]);
        })
    });

    describe("test multiple elements", function() {
        var $firstDiv, $secondDiv;
        beforeEach(function () {
            $('#test_container').remove();
            $('body').append($('<div/>').attr("id","test_container"));
            $firstDiv = $('<div/>');
            $secondDiv = $('<div/>');
            $('#test_container')
                .append($firstDiv)
                .append($secondDiv)
                .append($('<div/>'))
                .append($('<div/>'));
        });
        it("html(text) should write all div", function() {


            $('#test_container').find("div").html("Hello");

            expect($firstDiv.html()).toBe("Hello");
            expect($secondDiv.html()).toBe("Hello");

        });

        it("html() should return only the content of the first", function() {
            $firstDiv.html("Hello");
            $secondDiv.html("World");
            expect($('#test_container').find("div").html()).toBe("Hello")
        })
    });
}