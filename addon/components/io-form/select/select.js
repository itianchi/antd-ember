import Ember from 'ember';
import FormItemMixin from '../../../mixin/form-item';
import OutsideClick from '../../../mixin/outside-click';
import ComponentParent from '../../../mixin/component-parent';
import KeyBindingMixin from '../../../mixin/hotkey-bindings';

/**
 * Select Component
 */

export default Ember.Component.extend(FormItemMixin, ComponentParent, OutsideClick, KeyBindingMixin, {
	/**
	 * [tagName description]
	 */
	tagName: 'span',
	classNames: 'io-select input-custom',
	classNamePrefix: 'io-select-',
	classNameBindings: ['enabledClass', 'openClass'],
	attributeBindings: ['tabindex', 'role'],
	tabindex: 0,
	role: 'form-item-select',
	/**
	 * @attribute value 
	 * @type {String | Array}
	 */
	value: null,
	/**
	 * @attribute width 
	 * @type {Number}
	 */
	width: 120,
	/**
	 * @attribute disabled 
	 */
	disabled: false,
	/**
	 * @attribute multiple
	 * @description  [multiple select]
	 */
	multiple: false,
	/** 
	 * @attribute [placeholder]
	 */
	placeholder: '请选择',
	/**
	 * @attribute [options]
	 */
	options: Ember.A(),
	/**
	 * [combobox description]
	 * @type {Boolean}
	 */
	combobox: false,
	/**
	 * @state _hidden
	 * @type {Boolean}
	 * @description [hidden dropdown menu]
	 */
	_hidden: true,
	/**
	 * @state _activeValue
	 * @type {[type]}
	 */
	_activeValue: null,
	/**
	 * @attribute showDropdownSearch
	 * @type {[Boolean]}
	 * @description [show search input in dropdown menu if true]
	 */
	showDropdownSearch: false,
	/**
	 * [dropdownSearchText description]
	 * @type {String}
	 */
	dropdownSearchText: '',
	/**
	 * [dropdownSeachPlaceholder description]
	 * @type {String}
	 */
	dropdownSearchPlaceholder: '搜索',
	/**
	 * [_dropdownSearchPlaceholderVisible description]
	 * @return {[type]} [description]
	 */
	_dropdownSearchPlaceholderVisible: function() {
		const text = this.get('dropdownSearchText') || '';
		if (text === '') {
			return true;
		}
		return false;
	}.property('dropdownSearchText'),
	/**
	 * [_placeholderVisible description]
	 * @return {[type]} [description]
	 * _hidden === false indicated input element focused
	 */
	_comboboxPlaceholderVisible: function() {
		const text = this.get('value') || '';
		if (text === '') {
			return true;
		}
		return false;
	}.property('value'),
	/**
	 * @stae multipleClass
	 * @description [multiple select class]
	 */
	multipleClass: function() {
		var type = this.get('multiple') ? 'multiple' : 'single';
		return this.get('classNamePrefix') + 'selection--' + type;
	}.property('multiple'),
	/**
	 * @state hiddenClass
	 */
	hiddenClass: function() {
		const options = this.get('options');
		if (this.get('_hidden') || options.length === 0) {
			return this.get('classNamePrefix') + 'dropdown-hidden';
		} else {
			return '';
		}
	}.property('_hidden', 'options.length'),
	/**
	 * [comboboxClass description]
	 * @return {[type]} [description]
	 */
	comboboxClass: function() {
		if (this.get('combobox')) {
			return this.get('classNamePrefix') + 'combobox';
		} else {
			return '';
		}
	}.property('combobox'),
	/**
	 * [openClass description]
	 * @return {[type]} [description]
	 */
	openClass: function() {
		const options = this.get('options');
		if (!this.get('_hidden')) {
			if (this.get('combobox')) {
				if (options.length > 0) {
					return this.get('classNamePrefix') + 'open';
				} else {
					return '';
				}
			}
			return this.get('classNamePrefix') + 'open';
		} else {
			return '';
		}
	}.property('_hidden', 'options', 'options.length'),
	/**
	 * @state enabledClass
	 */
	enabledClass: function() {
		if (!this.get('disabled')) {
			return this.get('classNamePrefix') + 'enabled';
		} else {
			return '';
		}
	}.property('disabled'),
	/**
	 * @observe selectedChildren
	 */
	_selectOptions: function() {
		this.send('selectOptions');
	}.observes('value', 'value.length'),
	/**
	 * [_childrenChange description]
	 * @return {[type]} [description]
	 */
	_childrenChange: function() {
		this.send('selectOptions');
	}.observes('children', 'children.length'),
	/**
	 * [_comboSeachTextChange description]
	 * @return {[type]} [description]
	 */
	_comboSeachTextChange: function() {
		this.send('comboboxChange');
	}.observes('value'),
	/**
	 * dropdown search Text
	 */
	_dropdownSearchTextChange: function() {
		if (this.get('onSearch')) {
			this.sendAction('onSearch', this.get('dropdownSearchText'));
		}
	}.observes('dropdownSearchText'),
	/**
	 * [didInsertElement description]
	 * @return {[type]} [description]
	 */
	didInsertElement: function() {
		var _this = this;
		Ember.run.later(function() {
			_this.send('selectOptions');
		}, 10);
	},
	/**
	 * [actions description]
	 * @type {Object}
	 */
	actions: {
		/**
		 * [toggleHidden description]
		 * @return {[type]} [description]
		 */
		toggleHidden: function() {
			if (this.get('readonly')) {
				return;
			}
			this.set('_hidden', !this.get('_hidden'));
		},
		/**
		 * [selectOptions description]
		 * @return {[type]} [description]
		 */
		selectOptions: function() {
			const children = this.get('children');
			const multiple = this.get('multiple');
			let selectedOptions = [];

			children.forEach((child) => {
				if (this.isSelectedOption(child)) {
					child.set('selected', true);
					selectedOptions.push({
						value: child.get('value'),
						label: child.$().text()
					});
				} else  {
					child.set('selected', false);
				}
			});

			if (!multiple) {
				this.set('_selectedOptions', selectedOptions[0]);
			} else {
				this.set('_selectedOptions', selectedOptions);
			}
		},
		/**
		 * [onSelect description]
		 * @param  {[type]} option [description]
		 * @return {[type]}        [description]
		 */
		onSelect: function(option) {
			if (this.get('multiple')) {
				if (this.isSelectedOption(option)) {
					this.set('value', this.get('value').removeObject(option.get('value')));
				} else {
					this.set('value', this.get('value').addObject(option.get('value')));
				}
			} else {
				this.set('_hidden', true);
				this.set('value', option.get('value'));
			}
			this.send('onChange');
		},
		/**
		 * [removeOption description]
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
		removeOption: function(value) {
			this.set('value', this.get('value').removeObject(value));
			this.send('onChange');
		},
		/**
		 * [outsideClick description]
		 * @return {[type]} [description]
		 */
		outsideClick: function() {
			this.set('_hidden', true);
		},
		/**
		 * [onChange description]
		 * @return {[type]} [description]
		 */
		onChange: function() {
			Ember.run.later(() => {
				var $el = this.$();
				var $menu = this.$('.io-select-dropdown');
				$menu.css('top', ($el.height() + 5) + 'px' );
			}, 100);

			if (this.get('onChange')) {
				this.sendAction('onChange', this.get('value'));
			}

			setTimeout(() => {
				this.$().trigger('input.bs.validator');
			}, 500);
		},
		'keyup-down': function() {
			const children = this.get('children');

			if (children.length === 0) {
				return;
			}

			if (this.get('_hidden')) {
				this.set('_hidden', false);
				children[0].set('active', true);
			} else {
				let selectedIndex = -1;
				children.forEach((child, index) => {
					if (child.get('active')) {
						selectedIndex = index;
					}
					child.set('active', false);
				});
				selectedIndex += 1;
				if (selectedIndex >= children.length) {
					selectedIndex = 0;
				}
				children[selectedIndex].set('active', true);
			}
		},
		'keyup-up': function() {
			const children = this.get('children');

			if (children.length === 0) {
				return;
			}

			if (!this.get('_hidden')) {
				let selectedIndex = 0;
				children.forEach((child, index) => {
					if (child.get('active')) {
						selectedIndex = index;
					}
					child.set('active', false);
				});
				selectedIndex -= 1;
				if (selectedIndex < 0) {
					selectedIndex = children.length - 1;
				}
				children[selectedIndex].set('active', true);
			}
		},
		'keyup-return': function() {
			const children = this.get('children');

			if (children.length === 0) {
				return;
			}

			if (this.get('_hidden')) {
				this.set('_hidden', false);
			} else {
				children.forEach((child) => {
					if (child.get('active')) {
						this.send('onSelect', child);
					}
				});
			}
		},
		/**
		 * [comboboxOnFocus description]
		 * @return {[type]} [description]
		 */
		comboboxOnFocus: function() {
			this.set('_hidden', false);
		},
		/**
		 * [comboboxOnFocusout description]
		 * @return {[type]} [description]
		 */
		comboboxOnFocusout: function() {
			// this.set('_hidden', true);
		},
		/**
		 * [comboboxChange description]
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
		comboboxChange: function() {
			this.send('onChange');
		}
	},
	/**
	 * [isSelectedOption description]
	 * @param  {[type]}  child [description]
	 * @return {Boolean}       [description]
	 */
	isSelectedOption: function (child) {
		var multiple = this.get('multiple');
		var childValue = child.get('value');
		var value = this.get('value');
		if (multiple) {
			return value.contains(childValue);
		} else {
			return  childValue === value;
		}
	}
});