/*
 * timepicker
 */

import Ember from 'ember';
import FormItemMixin from 'ember-cli-idcos/mixin/form-item';
import OutsideClick from 'ember-cli-idcos/mixin/outside-click';

const moment = window.moment;
export default Ember.Component.extend(FormItemMixin, OutsideClick, {
  tagName: "span",
  a: "heee",
  classNames: "io-time-picker io-custom",
  classNamePrefix: "io-time-picker-",
  /**
   * @attribute [format description]
   * @type {String}
   */
  format: "HH:mm:ss",
  /**
   * @attribute [size description]
   * @type {String}
   */
  size: 'medium',
  /**
   * [value description]
   * @type {[type]}
   */
  value: null,
	/**
	 * @attribute [value description]
	 * @type {[type]}
	 */
	_selectedTime: null,
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
  /**
   * align
   */
  align: {
    offset: [0, -2],
  },
	/**
	 * disabled Time
	 */
	disabled: false,
  /**
   * disabled Hours
   */
  disabledHours: undefined,
  /**
   * disabled Minutes
   */
  disabledMinutes: undefined,
  /**
   * disabled Seconds
   */
  disabledSeconds: undefined,
  /**
   * Hide Disabled Options
   * @type {Boolean}
   */
  hideDisabledOptions: false,
  placement: 'bottomLeft',
  transitionName: 'slide-up',
  _onInit: function() {
    moment.locale(this.get('locale'));
    // this.set('_selectedTime', moment());
	}.on('init'),
	/**
	 * [_display description]
	 * @return {[type]} [description]
	 */
	_display: function() {
		if (this.get('_selectedTime')) {
			return this.get('_selectedTime').format(this.get('format'));
		} else {
			return '';
		}
	}.property('_selectedTime'),
  _leadingZero: function(num, size) {
    let str = String(num);
    while (str.length < (size || 2)) {str = "0" + num;}
    return str;
  },
  _range: function(start, end) {
    let range = [], i;
    for (i = start; i < end; ++i) {
      range.push(this._leadingZero(i));
    }
    return range;
  },
  _times: function() {
		const selected = moment(this.get('_selectedTime')||undefined);
    let times = [];
    // hours
    times.push({title: "hours", values: this._range(0, 24), now: selected.format("HH")});
    // minutes
    times.push({title: "minutes", values: this._range(0, 60), now: selected.format("mm")});
    // seconds
    times.push({title: "seconds", values: this._range(0, 60), now: selected.format("ss")});

    return times;
	}.property('_selectedTime'),
  /**
   * @compute [ description ]
   * @type {Object}
   */
  actions: {
    showPicker: function() {
      this.set("_hidden", false);
    },
    clear() {
      this.send("onChange", null);
    },
    onSelectTime: function(unit, value) {
      let time = this.get("_selectedTime") || moment();
      time[unit](value);
      this.send("onChange", time);
    },
    onChange(time, notHidden) {
      this.setProperties({
        _selectedTime: time,
        _hidden: !notHidden,
        value: time ? time.format("HH:mm:ss") : null
      });
      if (this.get("onChange")) {
        this.sendAction("onChange", time);
      }
    },
    outsideClick() {
      this.set("_hidden", true);
    }
  }
});
