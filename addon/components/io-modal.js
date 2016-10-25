import Ember from 'ember';

var openedModals = 0;

export default Ember.Component.extend({

  modalNode: null,

  show: false,

  visibility: Ember.computed('show', function () {
    return this.get('show') ? 'show' : 'hide';
  }),

  _onShowChange: Ember.observer('show', function () {
    var $node = this.get('modalNode');
    if ($node) {
      $node.modal(this.get('visibility'));
    }
  }),

  didInsertElement: function () {
    var $node = this.$('.modal').first();
    this.set('modalNode', $node);
    $node.modal(this.get('visibility'));

    if (this.$('.modal-content').draggable) {
      this.$('.modal-content').draggable({
        handle: ".modal-header",
        revert: true
      })
    }

    $node.on('shown.bs.modal', function () {
      openedModals += 1;
    });

    $node.on('hidden.bs.modal', function () {
      openedModals -= 1;

      if (hasOpenedModal()) {
        Ember.$('body').addClass('modal-open');
      }
    });
  },

  willDestroyElement: function () {
    this.get('modalNode').modal('hide');
  }
});

var hasOpenedModal = function () {
  return openedModals > 0;
}
