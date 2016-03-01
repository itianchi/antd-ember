import Ember from 'ember';
import Upload from './inner-upload';
import uid from './uid';


/**
 * AjaxUpload Component
 ```html
 ``` 
 */

export default Ember.Component.extend(Upload, {
	tagName: 'span',
	attributeBindings: ['role', 'tabIndex'],
	classNames: 'io-upload',
	tabIndex: 0,
	role: 'button'
});