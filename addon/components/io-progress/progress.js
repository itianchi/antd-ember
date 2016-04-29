/**
 * progress component
 */

import Ember from 'ember';

export default Ember.TextField.extend({
	tagName: 'div',
	classNames: 'io-progress io-progress-line-wrap clearfix',
	classNamePrefix: 'io-progress-',
	classNameBindings: ['statusClass'],
	/**
	 * [percent progress ${percent}/100]
	 * @type {Number}
	 */
	percent: 0,
	/**
	 * [status progress status: (active, exception)]
	 * @type {String}
	 */
	status: 'normal',
	/**
	 * [showInfo progress infomation]
	 * @type {Boolean}
	 */
	showInfo: true,
	/**
	 * [strokeWidth progress bar stroke style]
	 * @type {Number}
	 */
	strokeWidth: 10,
	/**
	 * [isSuccess description]
	 * @return {Boolean} [description]
	 */
	isSuccess: function() {
		return this.get('percent') === 100;
	}.property('percent'),
	/**
	 * [isError description]
	 * @return {Boolean} [description]
	 */
	isError: function() {
		return this.get('status') === 'exception';
	}.property('status'),
	/**
	 * statusClass
	 */
	statusClass: function() {
		let status = this.get('status');
		if (this.get('isSuccess')) {
			status = 'success';
		}
		return 'status-' + status;
	}.property('status')
});





