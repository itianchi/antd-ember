import Ember from 'ember';

export default Ember.Controller.extend({
	checked: '1',
	value: '',
	values: ['lucy', 'jack'],
	options: [{
		value: '1',
		label: 'jack'
	}, {
		value: '2',
		label: 'lucy'
	}, {
		value: '3',
		label: 'disabled',
		disabled: true
	}, {
		value: '4',
		label: '6174'
	}],
	_valueChange: Ember.observer('value', function() {
		alert('value change' + this.get('value'));
	}),
	actions: {
		onChange: function(values) {
			console.log(values);
		}
	}
});
