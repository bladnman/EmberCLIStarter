/* global require, module */

'use strict';

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var unwatchedTree = require('broccoli-unwatched-tree');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, require('./build/options'));

  var addonTreesFor = app.addonTreesFor.bind(app);

  app.addonTreesFor = function(type) {
    var trees = addonTreesFor(type);

    switch(type) {
      case 'styles':
        // grab style files in pods and app/components directories,
        // but not the ones in app/styles, they are already handled by ember-cli
        trees = trees.concat(new Funnel(unwatchedTree('app'), {
          exclude: [new RegExp('styles')],
          include: [new RegExp('.styl')]
        }));
        break;
    }

    return trees;
  };

  return app.toTree();
};
