import Ember from 'ember';

export
default Ember.Controller.extend({
    checked: true,
    _checkedOnChange: Ember.observer('checked', function() {
        alert(this.get('checked') ? 'checked' : 'uncheck');
    }),
    actions: {
        onChange: function(checked) {
            console.log('change ', checked);
            this.set('checked', checked);
        }
    }
});
