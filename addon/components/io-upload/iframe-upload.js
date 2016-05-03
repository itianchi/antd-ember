import Ember from 'ember';
import uid from './uid';
import AjaxFileUpload from './ajax-file-upload';

const {
    RSVP
} = Ember;

/**
 * IframeUpload Component
 ```html
 ``` 
 */
const $ = Ember.$;
export default Ember.Component.extend({
    tagName: 'span',
    attributeBindings: ['role', 'tabIndex'],
    classNames: 'io-upload io-iframe-upload',
    tabIndex: 0,
    role: 'button',
    id: 'input-' + uid(),
    /**
     * [multiple description]
     * @type {Boolean}
     */
    multiple: false,
    /**
     * [data description]
     * @type {[type]}
     */
    data: null,
    /**
     * [action description]
     * @type {String}
     */
    action: null,
    /**
     * [name filename]
     * @type {String}
     */
    name: 'file',
    /**
     * [domain description]
     * @type {String}
     */
    domain: null,
    iframeNode: null,
    loading: false,
    /**
     * @events data
     */
    // click(event) {
        // if (!$(event.target).hasClass('io-upload__input')) {
        //     const $input = this.$('input');
        //     $input.trigger('click');
        // }
    // },
    /**
     * @lifecycle didInsert
     */
    didInsertElement() {
        this.$('input').on('change', (ev) => {
            this.send('requestUpload', ev);
        });
    },
    /**
     * uploadFiles
     */
    uploadFiles(files) {
        const parentComponent = this.get('parent');
        const _this = this;
        if (files.length > 0) {
            /**
             * [before upload description]
             * @type {[type]}
             */
            const defer = RSVP.defer();
            if (!this.get('multiple')) {
                files = files[0];
            }
            defer.promise.then(() => {
                // before check pass
                AjaxFileUpload({
                    url: this.get('action'),
                    fileElement: this.$('input')[0],
                    data: this.get('data'),
                    timeout: 2000,
                    filename: this.get('name'),
                    onStart(ev) {
                        parentComponent.send(_this.get('onStart'), files);
                    },
                    onError(ev) {
                        parentComponent.send(_this.get('onError'), ev, null, files);
                        _this.$('input').val('');
                    },
                    onSuccess(ev) {
                        parentComponent.send(_this.get('onSuccess'), ev, files);
                        _this.$('input').val('');
                    }
                }); 
                this.$('input').on('change', (ev) => {
                    this.send('requestUpload', ev);
                }); 
            });
            parentComponent.send(this.get('beforeUpload'), defer);
        }
    },
    /**
     * @events data
     */
    actions: {
        requestUpload: function() {
            let input = this.$('input')[0];
            let files = input.files;
            if (files) {
                files = Array.prototype.slice.call(files);
            } else {
                files = [{
                    uid: uid(),
                    name: input.value
                }];
            }
            this.uploadFiles(files);
        }
    }
});