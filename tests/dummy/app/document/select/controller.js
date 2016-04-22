import Ember from 'ember';

const treeData = [{
  label: '节点一',
  value: '0-0',
  children: [{
    label: '子节点一',
    value: '0-0-0',
  }, {
    label: '子节点二',
    value: '0-0-1',
  }],
}, {
  label: '节点二',
  value: '0-1',
  children: [{
    label: '子节点三',
    value: '0-1-0',
  }, {
    label: '子节点四',
    value: '0-1-1',
    children: [{
    	label: '子节点五',
    	value: '0-1-1-1'
    }]
  }],
}];
export default Ember.Controller.extend({
	checked: '1',
	value: '',
	values: ['lucy', 'jack'],
	treeData: treeData,
	treeSelectedValue: '0-1-0',
	options: [{
		value: '1',
		label: 'jack'
	}, {
		value: '2',
		label: 'lucy'
	}, {
		value: '3',
		label: 'disabled',
		disabled: true
	}, {
		value: '4',
		label: '6174'
	}],
	_valueChange: Ember.observer('value', function() {
		alert('value change' + this.get('value'));
	}),
	actions: {
		onChange: function(values) {
			console.log(values);
		}
	}
});
