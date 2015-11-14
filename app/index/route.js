import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    //else if (!ApplicationState.getInstance().getReturningUser()) {
    //  this.transitionTo('porch');
    //}
  }
});
