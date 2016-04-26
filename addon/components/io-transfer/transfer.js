import Ember from 'ember';

const {
	set
} = Ember;
/**
 * Transfer 组件
 */

export default Ember.Component.extend({
	tagName: 'div',
	classNames: 'io-transfer',
	classNamePrefix: 'io-transfer-',
	/**
	 * [dataSource description]
	 * @type {[type]}
	 */
	dataSource: Ember.A(),
	/**
	 * [targetValuess description]
	 * @type {[type]}
	 */
	targetValues: Ember.A(),
	/**
	 * [_sourceList description]
	 * @return {[type]} [description]
	 */
	_sourceList: function() {
		const dataSource = this.get('dataSource');
		const targets = this.get('targetValues');
		// debugger
		let ret = dataSource.filter((it) => {
			return targets.indexOf(it.value) < 0;
		});
		return ret;
	}.property('dataSource', 'targetValues.length'),
	/**
	 * [_targetList description]
	 * @return {[type]} [description]
	 */
	_targetList: function() {
		const dataSource = this.get('dataSource');
		const targets = this.get('targetValues');
		let ret = dataSource.filter((it) => {
			return targets.indexOf(it.value) >= 0;
		});
		return ret;
	}.property('dataSource', 'targetValues.length'),
	/**
	 * [_sourceListChecked description]
	 * @type {Boolean}
	 */
	_sourceListChecked: false,
	_sourceListCheckedChange: function() {
		const checked = this.get('_sourceListChecked');
		const _sourceList = this.get('_sourceList');
		_sourceList.forEach((it) => {
			set(it, 'checked', checked);
		});
	}.observes('_sourceListChecked'),
	/**
	 * [_targetListChecked description]
	 * @type {Boolean}
	 */
	_targetListChecked: false,
	_targetListCheckedChange: function() {
		const checked = this.get('_targetListChecked');
		const _targetList = this.get('_targetList');
		_targetList.forEach((it) => {
			set(it, 'checked', checked);
		});
	}.observes('_targetListChecked'),
	/**
	 * [_transferButtonDisabled description]
	 * @return {[type]} [description]
	 */
	_transferButtonDisabled: function() {
		const _sourceList = this.get('_sourceList');
		let disabled = true;
		_sourceList.forEach((it) => {
			if (it.checked) {
				disabled = false
				return false;
			}
		});
		return disabled;
	}.property('_sourceList.@each.checked', '_sourceList.length'),
	/**
	 * [_transferBackButtonDisabled description]
	 * @return {[type]} [description]
	 */
	_transferBackButtonDisabled: function() {
		const _targetList = this.get('_targetList');
		let disabled = true;
		_targetList.forEach((it) => {
			if (it.checked) {
				disabled = false
				return false;
			}
		});
		return disabled;
	}.property('_targetList.@each.checked', '_targetList.length'),
	/**
	 * [actions description]
	 * @return {[type]} [description]
	 */
	actions: {
		transfer() {
			const _sourceList = this.get('_sourceList');
			let targetValues = this.get('targetValues');

			_sourceList.forEach((it) => {
				if (it.checked && targetValues.indexOf(it.value) < 0) {
					targetValues.pushObject(it.value);
					set(it, 'checked', false);
				}
			});

			this.set('_sourceListChecked', false);
		},
		transferBack() {
			const _targetList = this.get('_targetList');
			let targetValues = this.get('targetValues');
			_targetList.forEach((it) => {
				if (it.checked && targetValues.indexOf(it.value) >= 0) {
					targetValues.removeObject(it.value);
					set(it, 'checked', false);
				}
			});
			this.set('_targetListChecked', false);
		}
	}
});