import Ember from 'ember';
import uid from './uid';
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
    click(event) {
        const input = this.getFormInputNode();
        if (!$(event.target).hasClass('io-upload__input') && input) {
            const $input = this.$(input);
            $input.trigger('click');
            $input.val('');
        }
    },
    /**
     * [didInsertElement description]
     * @return {[type]} [description]
     */
    didInsertElement() {
        const action = this.get('action');
        const name = this.get('name');
        const iframeNode = this.$('iframe')[0];
        this.set('iframeNode', iframeNode);
        this.initIframeSrc();
        this.initIframeHtml();
    },
    /**
     * [_actionChange description]
     * @return {[type]} [description]
     */
    _actionChange: function(){
        this.initIframeHtml();
    }.observes('action'),
    /**
     * [initIframeSrc description]
     * @param  {[type]} domain [description]
     * @return {[type]}        [description]
     */
    initIframeSrc() {
        const domain = this.getDomain();
        const iframeNode = this.$('iframe')[0];
        iframeNode.src = `javascript:void((function(){
            var d = document;
            d.open();
            d.domain='${domain}';
            d.write('');
            d.close();
        })())`;
    },
    /**
     * [initIframeHtml description]
     * @return {[type]} [description]
     */
    initIframeHtml() {
        let win;
        let doc;
        const iframeNode = this.getIframeNode();
        try {
            win = iframeNode.contentWindow;
            doc = win.document;
            doc.open('text/html', 'replace');
            doc.write(this.getIframeHTML());
            doc.close();
            this.getFormInputNode().onchange = this.onChange.bind(this);
            iframeNode.onload = (ev) => {
                this.onLoad();
            }
        } catch(e) {
            console.log(e);
        }
    },
    /**
     * [getIframeHTML description]
     * @param  {[type]} domain [description]
     * @return {[type]}        [description]
     */
    getIframeHTML() {
        const domain = this.getDomain();
        let domainScript = '';
        let domainInput = '';
        const action = this.get('action');
        const name = this.get('name');
        if (domain) {
            domainScript = `<script>document.domain="${domain}";</script>`;
            domainInput = `<input name="_documentDomain" value="${domain}" />`;
        }
        return `
		    <!DOCTYPE html>
		    <html>
			    <head>
				    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
				    <style>
				    body,html {padding:0;margin:0;border:0;overflow:hidden;}
				    </style>
				    ${domainScript}
			    </head>
			    <body>
				    <form method="post" encType="multipart/form-data" action="${action}" id="form" style="display:block;height:9999px;position:relative;overflow:hidden;">
					    <input id="input" class="io-upload__input" type="file" name="${name}" style="position:absolute;top:0;right:0;height:9999px;font-size:9999px;cursor:pointer;"/>
					    ${domainInput}
					    <span id="data"></span>
				    </form>
			    </body>
		    </html>
		    `;
    },
    getDomain() {
        return this.get('domain') || document.domain;
    },
    getIframeNode() {
        return this.$('iframe')[0];
    },
    getIframeDocument() {
        return this.getIframeNode().contentDocument;
    },
    getFormNode() {
        return this.getIframeDocument().getElementById('form');
    },
    getFormInputNode() {
        return this.getIframeDocument().getElementById('input');
    },
    getFormDataNode() {
        return this.getIframeDocument().getElementById('data');
    },
    getFileForMultiple(file) {
        return this.get('multiple') ? [file] : file;
    },
    enableIframe() {
        this.set('loading', false);
    },
    disabledIframe() {
        this.set('loading', true);
    },
    /**
     * [onChange description]
     * @return {[type]} [description]
     */
    onChange() {
        const action = this.get('action');

        if (!action) {
            return;
        }

        const target = this.getFormInputNode();
        const parent = this.get('parent');
        // ie8/9 don't support FileList Object
        // http://stackoverflow.com/questions/12830058/ie8-input-type-file-get-files
        const file = {
            uid: uid(),
            name: target.value,
        };

        this.set('_file', file);

        if (parent && this.get('onStart')) {
            parent.set('_recentUploadStatus', true);
	        parent.send('onStart', this.getFileForMultiple(file));
        }

        const formNode = this.getFormNode();
        const dataSpan = this.getFormDataNode();
        let data = this.get('data');
        const inputs = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                inputs.push(`<input name="${key}" value="${data[key]}"/>`);
            }
        }

        dataSpan.innerHTML = inputs.join('');
        formNode.submit();
        dataSpan.innerHTML = '';
        this.disabledIframe();
    },
    /**
     * [onLoad description]
     * @return {[type]} [description]
     */
    onLoad() {
        if (!this.loading) {
            return;
        }
        const props = this.props;
        const parent = this.get('parent');
        let response;
        const eventFile = this.get('_file');
        try {
            const doc = this.getIframeDocument();
            const script = doc.getElementsByTagName('script')[0];
            if (script && script.parentNode === doc.body) {
                doc.body.removeChild(script);
            }
            response = doc.body.innerHTML;
            if (parent && this.get('onSuccess')) {
	            parent.send('onSuccess', response, eventFile);
            }
        } catch (err) {
            console.log(err);
            // warning(false, 'cross domain error for Upload. Maybe server should return document.domain script. see Note from https://github.com/react-component/upload');
            response = 'cross-domain';
            if (parent && this.get('onError')) {
	            parent.send('onError', err, null, eventFile);
            }
        }
        this.enableIframe();
        this.initIframeSrc();
        this.initIframeHtml();
    },
    /**
     * @events data
     */
    actions: {
        onChange: function() {}
    }
});