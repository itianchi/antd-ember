/**
 * progress circle
 */

import Ember from 'ember';

export default Ember.TextField.extend({
	tagName: 'div',
	classNames: 'io-progress io-progress-circle-wrap clearfix',
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
	width: 132,
	size: Ember.computed.alias('width'),
	strokeDash: 295.31,
	strokeDashOffset: function() {
		return this.get('strokeDash') *  (100 - this.get('percent')) / 100;
	}.property('width'),
	fontSize: function() {
		return this.get('width') / 4.8;
	}.property('width'),
	/**
	 * [strokeColor description]
	 * @return {[type]} [description]
	 */
	strokeColor: function() {
		if (this.get('isSuccess')) {
			return '#87d068';
		}

		if (this.get('status') === 'exception') {
			return '#ff5500';
		}

		return "#2db7f5";
	}.property('status', 'isSuccess'),
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





