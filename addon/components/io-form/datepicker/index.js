/**
 * datepicker
 */

import Ember from 'ember';
import FormItemMixin from 'ember-cli-idcos/mixin/form-item';
import OutsideClick from 'ember-cli-idcos/mixin/outside-click';

const moment = window.moment;
export default Ember.Component.extend(FormItemMixin, OutsideClick, {
	tagName: 'span',
	a: "heee",
	classNames: 'io-datapicker io-calendar-picker',
	classNamePrefix: 'io-calendar-picker-',
	/**
	 * @attribute [value description]
	 * @type {[type]}
	 */
	_selectedDate: moment(),
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
	locale: 'zh-cn',
	_onInit: function() {
		moment.locale(this.get('locale'));
		this.set('_selectedDate', moment());
	}.on('init'),
	/**
	 * @compute [ description]
	 * @type {Object}
	 */
	_yearDisplay: function() {
		return this.get('_selectedDate').format('Y') + '年';
	}.property('_selectedDate'),
	_monthDisplay: function() {
		return this.get('_selectedDate').format('Mo');
	}.property('_selectedDate'),
	_days: function() {
		const selected = this.get('_selectedDate');
		const firstDay = moment(selected).startOf('month');
		const lastDay = moment(selected).endOf('month');
		const firstDayInWeek = firstDay.day();
		let days = [], i, l;
		for (i = firstDayInWeek; i > 0; i--) {
			days.push({
				m: moment(firstDay).subtract('days', i),
				preMonth: true
			});
		}

		let range = lastDay.date() - firstDay.date();
		for (i = 0; i <= range; i++) {
			days.push({
				m: moment(firstDay).add('days', i),
				currentMonth: true
			});
		}

		range = 42 - days.length;
		for (i = 1; i <= range; i++) {
			days.push({
				m: moment(lastDay).add('days', i),
				nextMonth: true
			});
		}

		days.forEach((day) => {
			day.display = day.m.date();
			day.classNames = '';

			if (day.currentMonth) {
			}
			const m = day.m;
			const n = moment();
			if (m.date() === n.date() &&
				m.month() === n.month() && 
				m.year() === n.year()) {
				day.classNames += ' io-calendar-today';
			}

			if (m.date() === selected.date() &&
				m.month() === selected.month() && 
				m.year() === selected.year()) {
				day.classNames += ' io-calendar-selected-day';
			}

			if (day.preMonth || day.nextMonth) {
				day.classNames += ' io-calendar-last-month-cell';
			}
		});

		let groups = [], tmpGroup = [];
		for (i = 1, l = days.length; i <= l; i ++) {

			// is current selected date
			let day = days[i - 1];
			tmpGroup.push(day);
			if (i % 7 === 0) {
				groups.push(tmpGroup);
				tmpGroup = [];
			}
		}

		return groups;
	}.property('_selectedDate'),
	_months: getMonths(),
	_years: function() {
	}.property('_selectedDate'),
	actions: {
		onSelectDate(date) {

		}
	}
});

function getMonths() {
	return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
}