/* global module */

'use strict';

var nib = require('nib');

module.exports = {
	stylusOptions: {
		use: [nib()],
		sourceMap: false
	},
  defeatureify: {
    'enableStripDebug': process.env.EMBER_ENV === 'production',
    'debugStatements': [
      'Ember.default.warn',
      'Ember.default.assert',
      'Ember.default.deprecate',
      'Ember.default.debug',
      'Ember.default.Logger.assert',
      'Ember.default.Logger.debug',
      'Ember.default.Logger.error',
      'Ember.default.Logger.info',
      'Ember.default.Logger.log',
      'Ember.default.Logger.warn',
      'console.assert',
      'console.clear',
      'console.count',
      'console.debug',
      'console.dir',
      'console.dirxml',
      'console.error',
      'console.group',
      'console.groupCollapsed',
      'console.groupEnd',
      'console.info',
      'console.log',
      'console.profile',
      'console.profileEnd',
      'console.select',
      'console.table',
      'console.time',
      'console.timeEnd',
      'console.trace',
      'console.warn'
    ],
    'features': {}
  }
};
