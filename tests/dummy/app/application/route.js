import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
		if (window.location.hash === '') {
			this.transitionTo('home');		
		}
	},
    model: function() {
    }
});
