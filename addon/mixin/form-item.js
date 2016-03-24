import Ember from 'ember';
import Form  from '../components/io-form/form';
import translateSize from '../utils/translate-size';

export default Ember.Mixin.create({
	classNamePrefix: 'form-item-',
	classNames: ['form-item'],
	attributeBindings: ['role', 'disabled', 'type', 'value:data-value', 'required', 'state', 'checked'],
	classNameBindings: ['disabledClass', 'readonlyClass', 'sizeClass'],
	role: 'form-item',
	/**
	 * [placeholder description]
	 * @type {String}
	 */
	placeholder: '请输入',
	/**
	 * [disabled description]
	 * @type {Boolean}
	 */
	disabled: false,
	/**
	 * [size description]
	 * @type {String}
	 */
	size: 'default',
	/**
	 * [readonly description]
	 * @type {Boolean}
	 */
	readonly: false,
	/**
	 * [_form description]
	 * @type {[type]}
	 */
	_form: null,
	dataError: Ember.computed.alias('data-error'),
	disabledClass: function() {
		if (this.get('disabled')) {
			return this.get('classNamePrefix') + 'disabled';
		} else {
			return '';
		}
	}.property('disabled'),
	readonlyClass: function() {
		if (this.get('readonly') === true) {
			return this.get('classNamePrefix') + 'readonly';
		} else {
			return '';
		}
	}.property('readonly'),
	sizeClass: function() {
		if (this.get('size')) {
			return this.get('classNamePrefix') + translateSize(this.get('size'))
		} else {
			return '';
		}
	}.property('size'),
	_didInsertElement: function() {
		let parent = this.nearestOfType(Form);
		const changeReadonly = () => {
			const readonly = parent.get('readonly');
			this.set('readonly', readonly);
			this.set('disabled', readonly);
		}
		if (parent) {
			this.set('_form', parent);
			changeReadonly();
			parent.addObserver('readonly', changeReadonly)
		}
	}.on('didInsertElement')
})