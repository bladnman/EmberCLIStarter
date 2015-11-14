/* jshint node: true */

/**
 *  Common Dev Toggles
 *  --live-reload=false     :     disable webwatcher reloading
 *  --live                  :     use live (non-fixture) data
 */

var _environment;
var _version;
var _commit;

var version = function() {
  if (!_version) {
    _version        = require('../package.json').version;
  }

  return _version;
};
var commit = function() {
  if ( !_commit ) {
    _commit = require('child_process').execSync('git rev-parse --short HEAD').toString().trim();
  }
  return _commit;
};


/**
 *  LOCAL STATIC REQPAYLOAD
 *
 *  We will attempt to load the .local version of the staticReqPayload
 *  for use in certain (non-production) builds.
 *
 */
var localStaticReqPayloadValue   = null;
try {
  localStaticReqPayloadValue     = require('./reqpayload.local.js');
  console.log('****');
  console.log('**** YOU HAVE A STATIC REQ PAYLOAD SET FOR THIS ENVIRONMENT');
  console.log('****');
} catch (ex) {}





module.exports = function (environment) {
  //console.log('* * * *  ENVIRONMENT TYPE:', environment);

  // This function is called a number of times during build. If we are running development the last
  // call will be for the test environment. To differentiate with actual explicit --environment=test
  // run save off the environment from first call which should be "development", "production", or
  // "test". We can key off of this later to do any necessary logic related to an explicit test run
  // or running test within development or production mode.
  _environment = _environment || environment;

  var argv = require('yargs').argv;

  var ENV                   = {
    modulePrefix            : 'baroness',
    environment             : environment,
    baseURL                 : '/',
    locationType            : 'auto',
    i18n                    : {
      defaultLocale         : 'en'
    },
    https                   : {
      enabled               : true,
      port                  : 4430
    },

    EmberENV                : {
      FEATURES              : {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    APP                     : {
      // Here you can pass flags/options to your application instance
      // when it is created
      version               : version(),
      commit                : commit(),
      line                  : 'e1-np',
      rootElement           : '#baroness-area',
      useFixtures           : ! shouldUseLiveData(environment, argv),
      // during dev, probably want to remove log statements completely during release build
      log                   : {
        history             : false
      },
      staticReqPayload      : null
    }
  };

  var allowedSrc      = [" 'self' ",
    'ws://localhost:35729',
    'https://sentv-user-ext.totsuko.tv',
    'https://sentv-user-action.totsuko.tv',
    'https://epg-service.totsuko.tv',
    'https://sentv-user-auth.totsuko.tv',
    'https://media-framework.totsuko.tv',
    'https://auth.api.sonyentertainmentnetwork.com',
    'https://sentv-epg-dev.bamnetworks.com',
    'https://sentv-user-auth-dev.bamnetworks.com',
    'https://sentv-user-ext-dev.bamnetworks.com',
    'https://sentv-user-action-dev.bamnetworks.com',
    'https://sentv-mf-dev.bamnetworks.com',
    'https://auth.api.e1-np.sonyentertainmentnetwork.com',
    'http://5cfe7.s.fwmrm.net/s' // freewheel
  ];
  var scriptSrc       = [" 'self' 'unsafe-eval' ", 'http://localhost:35729'];

  ENV.contentSecurityPolicy     = {
    'connect-src'               : allowedSrc,
    'font-src'                  : [" 'self' ", 'data:'],
    'img-src'                   : [" 'self' ",
      'epg-image.totsuko.tv',
      'sentv-image-origin.bamnetworks.com',
      'spe1.tmsimg.com',
      'qaepgimg.mlbcontrol.net',
      'bladnman.com'],
    'script-src'                : scriptSrc,
    'style-src'                 : [" 'self' ", " 'unsafe-inline' "],
    'frame-src'                 : ['https://auth.api.e1-np.sonyentertainmentnetwork.com/',
      'https://auth.api.q1-np.sonyentertainmentnetwork.com/',
      'https://baroness.e1-np.api.playstation.com/',
      'https://baroness.q1-np.api.playstation.com/',
      'https://auth.api.sonyentertainmentnetwork.com/',
      'http://localhost:4400/'
    ]
  };

  // set the default value
  environment = environment || 'development';


  for(var name in ENV.contentSecurityPolicy) {
    ENV.contentSecurityPolicy[name]   = ENV.contentSecurityPolicy[name].join(' ');
  }

  /**
   *  D E V E L O P M E N T
   */
  if ( environment === 'development' ) {
    /**
     *  LIVE DATA FORCE:
     *
     *  > ember server --live
     *
     */
      //ENV.locationType        = 'auto';
    ENV.APP.useFixtures       = !shouldUseLiveData(environment, argv);
    ENV.APP.staticReqPayload  = localStaticReqPayloadValue || null;

  }

  /**
   *  T E S T : bladnman.com
   */
  else if ( environment === 'test:bladnman.com' ) {
    ENV.baseURL               = '/sony/baroness/';
    ENV.APP.staticReqPayload  = localStaticReqPayloadValue || null;
  }

  /**
   *  ALL OTHER : T E S T
   */
  else if ( environment.indexOf('test') === 0 ) {
    ENV.locationType          = 'hash';
    ENV.APP.staticReqPayload  = localStaticReqPayloadValue || null;
  }

  /**
   *  P R O D U C T I O N
   */
  else if ( environment === 'production' ) {
    ENV.locationType          = 'hash';
  }

  return ENV;
};



function shouldUseLiveData(environment, argv) {
  if(_environment !== environment && environment === 'test') {
    environment = _environment;
  }

  // default to dev mode
  if (typeof environment === 'undefined' || environment === null) {
    environment = 'development';
  }

  // default to prod-like argv
  if (typeof argv === 'undefined' || argv === null) {
    argv = {
      live: true,
      fixture: false
    };
  }

  var useLiveDataFlag = !!argv.live;
  var useFixtureDataFlag = !!argv.fixture;

  // ALWAYS LIVE FOR PRODUCTION
  if (environment === 'production') {
    return true;
  }

  // DEVELOPMENT -- assume to use fixtures
  if (environment === 'development') {
    return useLiveDataFlag;
  }

  // TEST -- assume to use live
  if (environment.indexOf('test') === 0) {
    return !useFixtureDataFlag;
  }

  // worst case, use real data so there are no slips for customers
  return true;

}
