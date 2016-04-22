import UnsaveNotificationMixin from 'ember-cli-idcos/mixin/unsave-notification';


export default {
	name: 'unsave-notification',
	initialize() {
		Ember.Route.reopen(UnsaveNotificationMixin);
		Ember.Controller.reopen(UnsaveNotificationMixin);
	}
}