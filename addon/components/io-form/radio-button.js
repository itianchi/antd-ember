import Ember from 'ember';
import FormItemMixin from '../../mixin/form-item';
import ComponentChild from '../../mixin/component-child';

/**
 * RadioButton Component
 ```html
 ``` 
 */

export default Ember.Component.extend(ComponentChild, FormItemMixin, {
	/**
	 * [tagName description]
	 */
	tagName: 'label',
	classNames: 'io-radio-button io-btn',
	classNamePrefix: 'io-radio-button-',
	attributeBindings: ['checked', 'name', 'onClick'],
	classNameBindings: ['checkedClass'],
	/**
	 * [attributes for component]
	 * @type {Boolean}
	 */
	checked: null,
	value: null,
	checkedClass: function() {
		if (this.get('checked') === this.get('value')) {
			return this.get('classNamePrefix') + 'checked';
		} else {
			return '';
		}
	}.property('checked'),
	htmlChecked: function() {
		return this.get('value') === this.get('checked');
	}.property('checked', 'value'),
	actions: {
		change: function() {
			if (this.get('disabled') || this.get('readonly')) {
				return;
			}
			this.set('checked', this.get('value'));

            if (this.get('onClick')) {
                this.sendAction('onClick', this);
            } else {
                this.sendAction(this);
            }
        },
    }
});
