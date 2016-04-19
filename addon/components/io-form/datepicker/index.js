/**
 * datepicker
 */

import Ember from 'ember';
import FormItemMixin from 'ember-cli-idcos/mixin/form-item';
import OutsideClick from 'ember-cli-idcos/mixin/outside-click';

export default Ember.Component.extend(FormItemMixin, OutsideClick, {
	taName: 'span',
	classNames: 'io-datapicker',
	classNamePrefix: 'io-datapicker-',
	/**
	 * @attribute [value description]
	 * @type {[type]}
	 */
	value: null,
	/**
	 * @attribute [format description]
	 * @type {String}
	 */
	format: 'yyyy/MM/dd',
	/**
	 * @attribute  [size description]
	 * @type {String}
	 */
	size: 'medium',
	/**
	 * disabled Date
	 */
	disabledDate: () => {},
	/**
	 * @attribute  [locale description]
	 * @type {String}
	 */
	locale: '',
	actions: {
		onSelectDate(date) {
			
		}
	}
});