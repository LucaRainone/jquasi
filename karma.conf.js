module.exports = function(config) {

    var reporters = ['progress', 'coverage'];

    if(process.env.SENDCOVERALLS)
        reporters.push('coveralls');

    config.set({
        basePath:'',
        frameworks: [ 'jasmine','requirejs'],
        files: [
            {pattern:'node_modules/jquery/dist/jquery.min.js', included: true},
            {pattern: 'src/**/*.js', included: false},
            'spec/init.js',
            {pattern:'spec/**/*[sS]pec*.js', included: false}
            // 'node_modules/jquery/dist/jquery.min.js'
        ],
        preprocessors: {
            'src/**/*.js': ['coverage']
        },
        plugins: ['karma-jasmine',
            'karma-coverage', 'karma-requirejs','karma-chrome-launcher', 'karma-coveralls'],
        coverageReporter: {
            includeAllSources: true,
            dir: 'coverage/',
            reporters: [
                { type: "html", subdir: "html" },
                { type: 'text-summary' },
                { type: 'lcov', subdir: 'report-lcov' }
            ]
        },
        reporters: reporters,
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        // singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity
    });

};