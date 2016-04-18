import Ember from 'ember';

export default Ember.Controller.extend({
	checked: '1',
	name: 'my-radio',
	_checkedChange: Ember.observer('checked', function() {
		window.alert('checked radio value: ' + this.get('checked'));
	})
});
