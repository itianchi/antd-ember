import Ember from 'ember';
export
default Ember.Controller.extend({
    init: function() {
        var family = {
            title: 'Family',
            id: 'Family',
            children: [{
                title: 'Susan',
                id: 'asd',
                children: [{
                    title: 'Lucy'
                }]
            }, {
                title: 'Luda',
                id: 'haa'
            }]
        };
        return this.set('model', family);
    },
    actions: {
        expand: function() {
            this.get('selected').toggleProperty('expanded');
            return null;
        },
        onSelectNode: function(model) {
            console.log(model);
        }
    }
});