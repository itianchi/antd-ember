import AjaxUpload   from 'ember-cli-idcos/components/io-upload/ajax-upload';
import IframeUpload from 'ember-cli-idcos/components/io-upload/iframe-upload';

const Upload = window.FormData ? AjaxUpload : IframeUpload; 

export default Upload;