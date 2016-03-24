import Ember from 'ember';
import DisabledClass from '../../mixin/disabled-class';

/**
 * io-form
 
 # basic form
 ```
  {{#io-form}}
  {{/io-form}}
 ```
 # dynamic form
 ```
  {{io-form schema=schema formData=data}}

  // type = 
  let schema = {
    "title":"用户信息",
    "description":"填写用户呢",
    "properties": [{
      // field key
      field: "name",

      // field type
      // [text|number|password|select|enum|check|textarea]
      "type": "string",

      // field label
      "label": "名称：",

      // field placeholder
      "placeholder": "请输入用户名",

      // field label class
      "labelColClass": "col-md-8",

      // field input class
      "inputColClass": "col-md-5"

      // if required
      "required": true,

      // help message
      // "help": "",

      // error message
      //  "error": "请输入名称",

      //  regrex pattern
      //  "pattern": ""
    }, {
      field: "sex",
      type: "enum",
      label: "选择性别",
      enum: ["boy", "girl"],
      enumLabels: ["男", "女"]
    }, {
      field: "location",
      type: "select"
      label: "选择所在省份",
      options: ["a", "b", "c", "d"],
      optionLables: ["重庆", "北京", "广州", "上海"]
    }, {
      field: "description",
      type: "textarea",
      label: "自我介绍"
    }]
  }
 ```
 */
export default Ember.Component.extend(DisabledClass, {
  tagName: 'form',
  classNames: ['io-form', 'io-form-horizontal'],
  classNamePrefix: 'io-form-',
  classNameBindings: ['readonlyClass'],
  /**
   * @attribute  schema
   */
  schema: null,
  /**
   * @attribute formData
   */
  formData: {},
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