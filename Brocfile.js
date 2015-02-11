/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');

var app = new EmberApp({
  'vendorFiles': {
    'handlebars.js': null
  }
});

app.import('bower_components/web-animations-js/web-animations-next.min.js');
app.import('bower_components/bezier-easing/bezier-easing.js');
app.import('bower_components/eventEmitter/EventEmitter.min.js');

var workers = pickFiles('workers', {srcDir: '/', files: ['*.js'], destDir: '/' });

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree(workers);
