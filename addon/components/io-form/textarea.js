import Ember from 'ember';
import FormItemMixin from '../../mixin/form-item';

/**
 * io-input Component
 ```html
 ``` 
 */

export default Ember.Component.extend(FormItemMixin, {
	/**
	 * [tagName description]
	 */
	tagName: 'textarea',
	attributeBindings: ['rows', 'cols'],
	classNames: 'io-input',
	role: 'form-item-textarea',
	value: ''
});