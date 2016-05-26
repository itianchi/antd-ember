import Ember from 'ember';
import SelectedClass from '../../../mixin/selected-class';
import DisabledClass from '../../../mixin/disabled-class';

/**
 * io-tree-select-option Component
 */

export default Ember.Component.extend(SelectedClass, DisabledClass, {
	/**
	 * [tagName description]
	 */
	tagName: 'li',
	attributeBindings: ['disabled', 'role'],
	classNamePrefix: 'io-select-tree-node-',
	classNameBindings: ['activeClass'],
	role: 'select-tree-node',
	selected: function() {
		if (this.get('root.value') === this.model.value) {
			return true;
		} 
		return false;
	}.property('root.value'),
	actions: {
		toggleOpen(){
			this.set('model.open', !this.get('model.open'));
		},
		select() {
			if (this.get('model.disabled')) {
				return;
			}
			const root = this.get('root');
			root.send('onSelect', this);
		}
	}
});