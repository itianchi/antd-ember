import Ember from 'ember';
import DisabledClass from '../../mixin/disabled-class';

/**
 * Select Component
 */

export default Ember.Component.extend(DisabledClass, {
	/**
	 * [tagName description]
	 */
	tagName: 'span',
	attributeBindings: ['state', 'disabled', 'onClick', 'role'],
	classNames: 'io-select',
	classNamePrefix: 'io-select-',
	classNameBindings: ['multipleClass'],
	value: 'lucy',
	multipleClass: function() {
		var type = this.get('multiple') ? 'multiple' : 'single';
		return this.get('classNamePrefix') + 'selection--' + type;
	}.property('mutiple')
});