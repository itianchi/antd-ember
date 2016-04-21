import Ember from 'ember';
import request from 'ember-cli-idcos/components/io-upload/request';
const {
    // get,
    // set
    $
} = Ember;
export
default Ember.Controller.extend({
    name: 'file',
    action: '/upload.do',
    form: {
        name: '',
        password: ''
    },
    file: '',
    _fileChange: function() {
        const file = $('#fileUpload input')[0];
        console.log(file.files);
    }.observes('file'),
    actions: {
        onClick: function() {
            alert('click button')
        },
        submitForm: function() {
            const files = $('#fileUpload input')[0];
            const data = this.get('form');
            request({
                action: '/api/uploadfile',
                filename: 'filename',
                data: data,
                file: files[0],
                onProgress: e => {

                },
                onSuccess: ret => {

                },
                onError: ret => {

                }
            });  
        },
        onChange(ev) {
            if (ev.file.status !== 'uploading') {
                console.log(`${ev.file.name} 正在上传.... ${ev.file.percent}`);
            }

            if (ev.file.status === 'done') {
                console.log(`${ev.file.name} 上传成功。`);
            } 

            if (ev.file.status === 'error') {
                console.log(ev.file.response);
                console.log(`${ev.file.name} 上传失败。`);
            }
        },

    }
});