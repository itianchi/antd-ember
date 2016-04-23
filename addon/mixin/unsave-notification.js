import Ember from 'ember';

const swal = window.swal;
const $ = Ember.$;

const DEFAULT_OPTIONS = {
	title: "确定要离开?",
	text: "还有未保存的修改， 离开后所有数据将丢失"
}
export default Ember.Mixin.create({
	/**
	 * [_onActivate description]
	 * @return {[type]} [description]
	 */
	_onActivate: function() {
		this.unsaveNotificationWindowClose = this.unsaveNotificationWindowClose.bind(this);
		Ember.run.later(()=> {
			if (this.controller.get('unsaveNotification')) {
				$(window).bind("beforeunload", this.unsaveNotificationWindowClose);
			}
		});
	}.on('activate'),
	/**
	 * [_onDeactivate description]
	 * @return {[type]} [description]
	 */
	_onDeactivate: function() {
		// if (this.controller.get('unsaveNotification')) {
		// 	alert('deactivate');
		// }
	}.on('deactivate'),
	/**
	 * [unsaveNotificationWindowClose description]
	 * @return {[type]} [description]
	 */
	unsaveNotificationWindowClose(event) {
		if (this.controller.get('unsaveNotification.hasUnsaveData')) {
			return this.controller.get('unsaveNotification.options.text') || DEFAULT_OPTIONS.text; 
		}
	},
	/**
	 * [unsaveNotification description]
	 * @param  {[type]}   options  [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
    unsaveNotificationConfirm(options, callback) {
    	options = options || {};
        swal({
            title: options.title || DEFAULT_OPTIONS.title,
            text: options.text || DEFAULT_OPTIONS.text,
            type:  options.type || "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: options.confirmButtonText || "确定离开",
            cancelButtonText: options.cancelButtonText || '取消',
            closeOnConfirm: true
        }, (isConfirm) => {
        	if (isConfirm) {
        		this.controller.set('unsaveNotification.forceTransition', true);
        	}
        	callback(isConfirm);
        	this.controller.set('unsaveNotification.forceTransition', false);
        });
    },
    _actions: {
        willTransition(transition) {
            if (this.controller.get('unsaveNotification.hasUnsaveData') && !this.controller.get('unsaveNotification.forceTransition')) {
	            transition.abort();
            	this.unsaveNotificationConfirm(this.controller.get('unsaveNotification.options'), (isConfirm) => {
            		if (isConfirm) {
            			transition.retry();
            		}
            	});
            } else {
            	if (this.controller.get('unsaveNotification')) {
	            	$(window).unbind('beforeunload', this.unsaveNotificationWindowClose);
            	}
                return true;
            }
        }
    },

});