
if(window.__karma__) {

    require.config({
       // Karma serves files under /base, which is the basePath from your config file
       baseUrl  : '/base/src/',
       // dynamically load all test files
       deps     : ["../spec/domSpec"],
       // we have to kickoff jasmine, as it is asynchronous
       callback : function(domSpec) {
           require(["jquery", "jquasi"], function($, jquasi) {

               jasmine.getEnv().randomizeTests(false);
               // jasmineEnv.randomizeTests(false);
               describe("jquasi must works", function() {
                   domSpec.start(jquasi,$);
               });

               describe("test must works against jQuery", function() {

                   domSpec.start($,$);

               });
               window.__karma__.start()

           });
       }
   });

}
