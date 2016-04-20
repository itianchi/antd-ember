/* jshint node: true */
'use strict';
module.exports = {
    name: 'ember-cli-idcos',
    blueprintsPath: function() {
        // return path.join(__dirname, 'blueprints');
    },
    included: function(app, parentAddon) {
        this._super.included(app);
        app = (parentAddon || app);
        var bowerDirectory = 'vendor/lib';
        app.import(bowerDirectory + '/bootstrap/dist/js/bootstrap.min.js');
        app.import(bowerDirectory + '/bootstrap-validator/js/validator.js');
        app.import(bowerDirectory + '/bootstrap-sweetalert/lib/sweet-alert.js');
        app.import(bowerDirectory + '/moment/moment.min.js');
        app.import(bowerDirectory + '/moment/locale/zh-cn.js');
        // app.import(bowerDirectory + "/font-awesome/fonts/fontawesome-webfont.eot", { destDir: "fonts" });
        // app.import(bowerDirectory + "/font-awesome/fonts/fontawesome-webfont.svg", { destDir: "fonts" });
        // app.import(bowerDirectory + "/font-awesome/fonts/fontawesome-webfont.ttf", { destDir: "fonts" });
        // app.import(bowerDirectory + "/font-awesome/fonts/fontawesome-webfont.woff", { destDir: "fonts" });
        // app.import(bowerDirectory + "/font-awesome/fonts/fontawesome-webfont.woff2", { destDir: "fonts" });
        // app.import(bowerDirectory + "/font-awesome/fonts/FontAwesome.otf", { destDir: "fonts"});
        ['eot', 'svg', 'ttf', 'woff'].forEach(function(type) {
            app.import('vendor/styles/antd/font/iconfont.' + type, {destDir: "fonts/antd"});
            // app.import('vendor/lib/font-awesome/fonts/fontawesome-webfont.' + type, {destDir: "fonts"});
        });
    }
};