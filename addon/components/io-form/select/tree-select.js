import Ember from 'ember';
import FormItemMixin from 'ember-cli-idcos/mixin/form-item';
import OutsideClick from 'ember-cli-idcos/mixin/outside-click';

export default Ember.Component.extend(FormItemMixin, OutsideClick, {
	tagName: 'span',
	classNames: 'io-select input-custom',
	classNamePrefix: 'io-select-',
	classNameBindings: ['enableClass', 'openClass', 'enabledClass'],
	attributeBindings: ['tabindex', 'role'],
	tabindex: 0,
	role: 'form-item-tree-select',
	/**
	 * [value description]
	 * @type {[type]}
	 */
	value: null,
	/**
	 * [treeData description]
	 * @type {[type]}
	 */
	treeData: null,
	/**
	 * [treeNodeTemplate description]
	 * @type {[type]}
	 */
	treeNodeTemplate: null,
	/**
	 * [width description]
	 * @type {Number}
	 */
	width: 200,
	/**
	 * [disabled description]
	 * @type {Boolean}
	 */
	disabled: false,
	/**
	 * [showSearch description]
	 * @type {Boolean}
	 */
	showSearch: false,
	/**
	 * [multiple description]
	 * @type {Boolean}
	 */
	multiple: false,
	/**
	 * [placeholder description]
	 * @type {String}
	 */
	placeholder: '请选择',
	
	/**
	 * [_hidden description]
	 * @type {Boolean}
	 */
	_hidden: true,
	_activeValue: null,
	multipleClass: function() {
		var type = this.get('multiple') ? 'multiple' : 'single';
		return this.get('classNamePrefix') + 'selection--' + type;
	}.property('multiple'),
	/**
	 * @state hiddenClass
	 */
	hiddenClass: function() {
		if (this.get('_hidden')) {
			return this.get('classNamePrefix') + 'dropdown-hidden';
		} else {
			return '';
		}
	}.property('_hidden'),
	openClass: function() {
		if (!this.get('_hidden')) {
			return this.get('classNamePrefix') + 'open';
		} else {
			return '';
		}
	}.property('_hidden'),
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
	 * @selectedChildren
	 */
	_selectedOptions: function() {
		const treeData = this.get('treeData');
		const value = this.get('value');

		if (!value) {
			return  null;
		}

		return find(treeData, value);
	}.property('value', 'value.length'),
	/**
	 * [actions description]
	 * @type {Object}
	 */
	actions: {
		toggleHidden: function() {
			if (this.get('readonly')) {
				return;
			}
			this.set('_hidden', !this.get('_hidden'));
		},
		selectOptions: function(options) {

		},
		onSelect: function(child) {
			this.set('value', child.get('model').id);
			this.send('toggleHidden');
		},
		outsideClick: function() {
			this.set('_hidden', true);
		}
	}
});

/**
 * [find search tree]
 * @param  {[type]} tree  [description]
 * @param  {[type]} id [description]
 * @return {[type]}       [description]
 */
function find(tree, id) {
	let ret = null;

	if (Ember.isArray(tree)) {
		for (let i = 0, l = tree.length; i < l; i++) {
			ret = find(tree[i], id);
			if (ret) {
				break;
			}
		}
		return ret;
	} else if (tree) {
		if (tree.id === id) {
			return tree;
		} else if (tree.children && tree.children.length > 0) {
			return find(tree.children, id);
		}
	}
}