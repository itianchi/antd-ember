import Ember from 'ember';
import uid from './uid';
/**
 * IframeUpload Component
 ```html
 ``` 
 */
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
    action: '',
    /**
     * [name filename]
     * @type {String}
     */
    name: 'file',
    /**
     * [domain description]
     * @type {String}
     */
    domain: '',
    iframeNode: null,
    loading: false,
    /**
     * [didInsertElement description]
     * @return {[type]} [description]
     */
    didInsertElement() {
    	this.updateIframeWH();
        const action = this.get('action');
        const name = this.get('name');
        const iframeNode = this.$('iframe')[0];
        this.set('iframeNode', iframeNode);
        let win = iframeNode.contentWindow;
        let doc;
        let domain = this.domain || '';
        this.initIframeSrc(domain);
        try {
            doc = win.document;
        } catch (e) {
            domain = document.domain;
            this.initIframeSrc(domain);
            win = iframeNode.contentWindow;
            doc = win.document;
        }
        doc.open('text/html', 'replace');
        doc.write(this.getIframeHTML(domain));
        doc.close();
        this.getFormInputNode().onchange = this.onChange;
        this.getIframeNode.onload = this.onLoad;
    },
    /**
     * [initIframeSrc description]
     * @param  {[type]} domain [description]
     * @return {[type]}        [description]
     */
    initIframeSrc(domain) {
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
     * [getIframeHTML description]
     * @param  {[type]} domain [description]
     * @return {[type]}        [description]
     */
    getIframeHTML(domain) {
        let domainScript = '';
        let domainInput = '';
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
					    <input id="input" type="file" name="${name}" style="position:absolute;top:0;right:0;height:9999px;font-size:9999px;cursor:pointer;"/>
					    ${domainInput}
					    <span id="data"></span>
				    </form>
			    </body>
		    </html>
		    `;
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
        this.getIframeNode().style.display = '';
    },
    disabledIframe() {
        this.set('loading', true);
        this.getIframeNode().style.display = 'none';
    },
    updateIframeWH() {
        const rootNode = this.$()[0];
        const iframeNode = this.getIframeNode();
        iframeNode.style.height = rootNode.offsetHeight + 'px';
        iframeNode.style.width = rootNode.offsetWidth + 'px';
    },
    /**
     * [onChange description]
     * @return {[type]} [description]
     */
    onChange() {
        const target = this.getFormInputNode();
        // ie8/9 don't support FileList Object
        // http://stackoverflow.com/questions/12830058/ie8-input-type-file-get-files
        const file = this.file = {
            uid: uid(),
            name: target.value,
        };
        this.send('onStart', this.getFileForMultiple(file));
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
        let response;
        const eventFile = this.file;
        try {
            const doc = this.getIframeDocument();
            const script = doc.getElementsByTagName('script')[0];
            if (script && script.parentNode === doc.body) {
                doc.body.removeChild(script);
            }
            response = doc.body.innerHTML;
            this.send('onSuccess', response, eventFile);
        } catch (err) {
            // warning(false, 'cross domain error for Upload. Maybe server should return document.domain script. see Note from https://github.com/react-component/upload');
            response = 'cross-domain';
            this.send('onError', err, null, eventFile);
        }
        this.enableIframe();
        this.initIframe();
    },
    /**
     * @events data
     */
    actions: {
        onChange: function() {}
    }
});