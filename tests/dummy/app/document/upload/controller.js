import Ember from 'ember';
const {
    // get,
    // set
} = Ember;
export
default Ember.Controller.extend({
    name: 'file',
    action: '/upload.do',
    actions: {
        onClick: function() {
            alert('click button')
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

        }
    }
});