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
	classNameBindings: ['enabledClass', 'openClass', 'showSearchClass'],
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
	 * [combobox 自动提示搜索输入框]
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
	showSearch: false,
	showDropdownSearch: Ember.computed.alias('showSearch'),
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
		const options = this.get('options') || [];
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
	 * [showSearchClass description]
	 * @return {[type]} [description]
	 */
	showSearchClass: function() {
		const combobox = this.get('combobox');
		const showSearch = this.get('showDropdownSearch');
		const hidden = this.get('_hidden');

		if (combobox || !showSearch || hidden) {
			return '';
		} else {
			return this.get('classNamePrefix') + 'show-search';
		}

	}.property('_hidden', 'showDropdownSearch', 'combobox'),
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

		this.searchBoxTextChange();

		if (this.get('onSearch')) {
			this.sendAction('onSearch', this.get('dropdownSearchText'));
		}

	}.observes('dropdownSearchText'),
	/**
	 * [searchBoxTextChange description]
	 * @return {[type]} [description]
	 */
	searchBoxTextChange: function() {
		const dropdownSearchText = this.get('dropdownSearchText');
		const $els = this.$('.io-select-selection-selected-value, .io-select-selection__placeholder, io-select-search__field__placeholder');
		if (dropdownSearchText === '') {
			$els.css({
				opacity: .4,
				display: 'block'
			});
		} else {
			$els.css({
				opacity: 1,
				display: 'none'
			});
		}

		if (this.get('multiple')) {
			const $input = this.$('.io-select-search input');
			$input.css('width', stringWidth(dropdownSearchText) + 'px');
		}

		function stringWidth(string) {
			const $ = Ember.$;
			const $span = $(`<span>${string}</span>`);
			const $body = $('body');
			$span.css({
				'font-size': '12px'
			});
			$body.append($span);
			const width = $span.width();
			$span.remove();
			return Math.max(width, 30);
		}
	},
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
	toggleSearchbox: function() {
		let combobox = this.get('combobox');
		let hidden = this.get('_hidden');
		let showSearch = this.get('showDropdownSearch');
		if (!showSearch || combobox) {
			return;
		}

		this.set('dropdownSearchText', '');

		const $inputSearch = this.$('.io-select-search');
		const $selectedValue = this.$('.io-select-selection-selected-value');
		const $placeholder = this.$('.io-select-selection__placeholder');
		const $input = this.$('.io-select-search input');

		if (hidden) {
			$inputSearch.css({
				display: 'none'
			});
			$selectedValue.css({
				opacity: 1
			});
			$placeholder.css({
				opacity: 1
			});
		} else {
			$inputSearch.css({
				display: 'block'
			});
			$selectedValue.css({
				opacity: .4
			});
			$input.focus();
		}
	}.observes('_hidden'),
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
			const hidden = !this.get('_hidden');
			this.set('_hidden', hidden);
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
					let option = {
						value: child.get('value'),
						label: child.$().text()
					};
					selectedOptions.push(option);
				} else  {
					child.set('selected', false);
				}
			});

			if (!multiple) {
				this.set('_selectedOptions', selectedOptions[0]);
			} else {
				this.set('_selectedOptions', unique(selectedOptions));
			}

			function unique(arr) {
				let ret = [];
				for (let i = 0, l = arr.length; i < l; i++) {
					if (!find(ret, arr[i])) {
						ret.push(arr[i]);
					}
				}
				return ret;
			}

			function find(arr, item) {
				return arr.some((it) => {
					return it.value === item.value && it.label === it.label;
				});
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
				this.set('dropdownSearchText', '');
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
				if ($menu) {
					$menu.css('top', ($el.height() + 5) + 'px' );
				}
			}, 100);

			if (this.get('onChange')) {
			  console.log(this);
				this.sendAction('onChange', this.get('value'), this);
			}

			setTimeout(() => {
				if (this.$() && this.$().trigger) {
					this.$().trigger('input.bs.validator');
				}
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
