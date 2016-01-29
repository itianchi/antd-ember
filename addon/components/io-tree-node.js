import Ember from 'ember';
var set = Ember.set,
    get = Ember.get;
export default Ember.Component.extend({
    tagName: 'li',
    classNames: ['io-tree-node'],
    classNameBindings: ['activeClass'],
    activeClass: function() {
        var selectedId = this.get('tree.selectedId');
        var node = this.get('node');
        return (node.id === selectedId) ? 'active' : 'deactive';
    }.property('tree.selectedId'),
    selected: function() {
        return this.get('node') === this.get('tree.selectedNode');
    }.property('tree.selectedId'),
    show: function() {
        var treeQuery = this.get('tree.query'),
            nodeShow = this.get('node.show');
        if (treeQuery === '') {
            return true;
        }
        return nodeShow;
    }.property('tree.query', 'node.show'),
    checkedChange: function() {
        var checked = this.get('node.checked'),
            children = this.get('node.children') || [];

        children.forEach(function(child) {
            set(child, 'checked', checked);
        });

        if (this.get('node.hasCheckbox')) {
            this.get('tree').send('treeOnChecked', this.get('node'), this.get('parent'));
        }
    }.observes('node.checked'),
    actions: {
        toggleFold: function() {
            var node = get(this, 'node');
            set(node, 'isFolded', !get(node, 'isFolded'));
        },
        onClick: function() {
            this.get('tree').send('clickItem', get(this, 'node'));
        },
        getAsyncNode: function(node) {
            if (node.children && node.children !== null) {
                this.send('toggleFold');
                return;
            }

            Ember.$.getJSON(node.async).then(function(data) {
                if (!node.children) {
                    set(node, 'children', []);
                }

                if (node.asyncResolver) {
                    var children = node.asyncResolver(data);
                    node.children.pushObjects(children);
                }
                if (data.status === "success") {
                    node.children.pushObjects(data.list);
                }
                set(node, 'isFolded', false);
            });
        }
    }
});
