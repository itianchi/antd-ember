import Ember from 'ember';

/**
 * Mixin to set the appropriate class for components with differently styled types ("success", "danger" etc.)
 *
 * @class TypeClass
 * @namespace Mixins
 */
export default Ember.Mixin.create({
    _bindOutsideClick: function() {
        var $el = this.$();
        var _this = this;
        $('body').on('mousedown touchstart', function(ev) {
            if (!contains($el[0], ev.target)) {
                _this.send('outsideClick');
            }
        });
    }.on('didInsertElement')
});

function contains(root, n) {
  let node = n;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
};