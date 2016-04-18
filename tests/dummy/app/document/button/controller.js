import Ember from 'ember';

const {
    // get,
    // set
} = Ember;

export
default Ember.Controller.extend({
    isShowingModal: false,
    model: {
        checkMeOut: false
    },
    actions: {
        handleClick(btn) {
            alert(btn.get('param1'));
        }
    }
});
