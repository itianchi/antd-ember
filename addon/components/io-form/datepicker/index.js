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
	classNames: 'io-datapicker io-calendar-picker input-custom',
	// classNameBindings: [],
	classNamePrefix: 'io-calendar-picker-',
	/**
	 * @attribute [format description]
	 * @type {String}
	 */
	format: 'YYYY-MM-DD',
	/**
	 * @attribute  [size description]
	 * @type {String}
	 */
	size: 'medium',
	/**
	 * [value description]
	 * @type {[type]}
	 */
	value: null,
	/**
	 * disabled Date
	 */
	disabledDate: () => {},
	/**
	 * @attribute [value description]
	 * @type {[type]}
	 */
	_selectedDate: null,
	/**
	 * [_hidden description]
	 * @type {Boolean}
	 */
	_hidden: true,
	/**
	 * @attribute  [locale description]
	 * @type {String}
	 */
	locale: 'zh-cn',
	_onInit: function() {
		moment.locale(this.get('locale'));
		// this.set('_selectedDate', moment());
	}.on('init'),
	/**
	 * [_display description]
	 * @return {[type]} [description]
	 */
	_display: function() {
		if (this.get('_selectedDate')) {
			return this.get('_selectedDate').format(this.get('format'));
		} else {
			return '';
		}
	}.property('_selectedDate'),
	/**
	 * @compute [ description]
	 * @type {Object}
	 */
	_yearDisplay: function() {
		let time = this.get('_selectedDate') || moment();
		return time.format('Y') + '年';
	}.property('_selectedDate'),
	_monthDisplay: function() {
		let time = this.get('_selectedDate') || moment();
		return time.format('Mo');
	}.property('_selectedDate'),
	_days: function() {
		const selected = this.get('_selectedDate') || moment();
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
			day.title = day.m.format('YYYY-MM-DD');

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
		showPicker() {
			this.set('_hidden', false);
		},
		clear() {
			this.send('onChange', null);
		},
		today() {
			this.send('onChange', moment());
		},
		onSelectDate(date) {
			this.send('onChange', date);
		},
		onChange(date, notHidden) {
			this.set('_selectedDate', date);
			this.set('_hidden', !notHidden);
			this.set('value', date ? date.format('YYYY-MM-DD') : null);
			if (this.get('onChange')) {
				this.sendAction('onChange', date);
			}
		},
		outsideClick() {
			this.set('_hidden', true);
		},
		nextMonth() {
			const selected = this.get('_selectedDate') || moment();
			this.send('onChange', moment(selected).add('months', 1), true);
		},
		prevMonth() {
			const selected = this.get('_selectedDate') || moment();
			this.send('onChange', moment(selected).subtract('months', 1), true);
		},
		nextYear() {
			const selected = this.get('_selectedDate') || moment();
			this.send('onChange', moment(selected).add('years', 1), true);
		},
		prevYear() {
			const selected = this.get('_selectedDate') || moment();
			this.send('onChange', moment(selected).subtract('months', 1), true);
		}
	}
});

function getMonths() {
	return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
}
