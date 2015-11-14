import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {


  if(config.environment !== 'production') {
    //this.route('dev', function() {});
  }

});

export default Router;
