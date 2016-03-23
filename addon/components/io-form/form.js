import Ember from 'ember';
import DisabledClass from '../../mixin/disabled-class';

/**
 * io-form
 ```
  {{io-form}}
  {{/io-form}}
 ```
 */
export default Ember.Component.extend(DisabledClass, {
  tagName: 'form',
  classNames: ['io-form', 'io-form-horizontal'],
  classNamePrefix: 'io-form-',
  classNameBindings: ['readonlyClass'],
  /**
   * @attribute disabled
   */
  readonly: false,
  readonlyClass: function() {
    if (this.get('readonly')) {
      return this.get('classNamePrefix') + 'readonly';
    } else {
      return '';
    }
  }.property('readonly'),
  /**
   * @attribute disable force validate
   * @type {String}
   */
  validate: "",
  validateChange: function() {
    var $form = this.$();
    $form.validator('validate');
    var validatorInstance = $form.data('bs.validator');
    if (validatorInstance.hasErrors) {
      var err = validatorInstance.hasErrors();
      if(!err){
        this.sendAction('submitForm');
      }
    }
  }.observes("validate"),
  
  /**
   * [submit event handler]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  submit: function(e) {
    if (e && e.isDefaultPrevented && !e.isDefaultPrevented()) {
   	  e.preventDefault();
      try {
        this.sendAction('submitForm');
      } catch (err) {
        console.log('warning: ', err);
      }
    }
  },

  /**
   * [didInsertElement event handler]
   * @return {[type]} [description]
   */
  didInsertElement: function() {
    this.$().validator();

    if (this.get('disabled')) {
      // do things disabled
    }

  },

  /**
   * [willDestroy event handler]
   * @return {[type]} [description]
   */
  willDestroy: function() {
    const $form = this.$()
    $form && $form.validator('destroy');
  }
});