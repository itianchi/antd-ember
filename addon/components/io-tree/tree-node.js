import Em from 'ember';
import WithConfigMixin from '../../mixin/with-config';
var getProperty = function(obj, prop) {
    if (!obj) {
        return;
    }
    if (Em.typeOf(obj) === 'instance' || Em.canInvoke(obj, 'get')) {
        return obj.get(prop);
    } else {
        return obj[prop];
    }
};

/**
 * [walkArray array description]
 * @return {[type]} [description]
 */
function walkArray(tree, cb) {
    if (!tree) {
        return;
    }
    if (Ember.isArray(tree.children)) {
        tree.children.forEach(cb);
    } else {
        cb(tree);
    }
}

/**
 * [walkTree description]
 * @param  {[type]}   tree [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
function walkTree(tree, cb) {
    if (!tree) {
        return;
    }
    cb(tree);
    if (Ember.isArray(tree.children)) {
        tree.children.forEach((it) => {
            walkTree(it, cb);
        });
    }
}

/**
 * [arrPush description]
 * @param  {[type]} arr  [description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
function arrPush(arr, item) {
    if (arr.indexOf(item) < 0) {
        arr.pushObject(item);
    }
}

/**
 * [arrRemove description]
 * @param  {[type]} arr  [description]
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
function arrRemove(arr, item) {
    arr.removeObject(item);
}

/**
 * A node of a tree.
 *
 * @class TreeNode
 */
export default Em.Component.extend(WithConfigMixin, {
    attributeBindings: ['multiSelected'],
    /**
     * The model the tree node view is bound to
     */
    model: undefined,
    /**
     * A reference to the tree view, this property is auto set during component instantiation
     */
    tree: undefined,
    /**
     * A reference to the root model
     */
    rootModel: Em.computed.alias('tree.model'),
    /**
     * True if the node is currently expanded, meaning its children are visible.
     */
    expanded: Em.computed.alias('model.expanded'),
    /**
     * True if this node view is currently checked
     * This is only relevant if the tree configured to support multi selection
     */
    multiSelected: Em.computed.alias('model.selected'),
    /**
     * True if should render an icon tag for this node view
     */
    hasIcon: true,
    /**
     * True if this node can be single selected
     */
    selectable: true,
    /**
     * True if this node is currently single selected
     */
    selected: (function() {
        return this.get('tree.selected.id') === this.get('model.id');
    }).property('tree.selected'),
    /**
     * True if this node is currently loading,
     * Usually that means the node is defined asynchronously and its children are currently being loaded
     */
    loading: false,
    /**
     * true if the loading mode of the node's children should be async
     */
    async: function() {
        return this.get('model.async');
    }.property('model.async'),
    /**
     * true if this is a leaf node, meaning it has no children
     */
    leaf: (function() {
        return !this.get('model.children') || this.get('model.children.length') === 0;
    }).property('model.children.length'),
    tagName: 'li',
    classNameBindings: ['styleClasses', 'expandedClasses', 'leafClasses'],
    styleClasses: (function() {
        var _ref;
        return (_ref = this.get('config.tree.nodeClasses')) != null ? _ref.join(" ") : void 0;
    }).property(),
    expandedClasses: (function() {
        var _ref, _ref1;
        if (this.get('expanded')) {
            return (_ref = this.get('config.tree.nodeOpenClasses')) != null ? _ref.join(" ") : void 0;
        } else {
            return (_ref1 = this.get('config.tree.nodeCloseClasses')) != null ? _ref1.join(" ") : void 0;
        }
    }).property('expanded', 'leaf', 'loading'),
    nodeSelectedClasses: (function() {
        var _ref;
        if (this.get('selected')) {
            return (_ref = this.get('config.tree.nodeSelectedClasses')) != null ? _ref.join(" ") : void 0;
        } else {
            return null;
        }
    }).property('selected'),
    /**
     * handleToggleMultiSelect
     * if toggle triggered by hand ,then all the children of the node should toggled
     */
    handToggleMultiSelect: function() {
        let multiSelection = this.get('tree.multi-selection');
        const model = this.get('model');
        const multiSelected = this.get('multiSelected');
        if (!multiSelection) {
            return;
        }
        
        if (!Ember.isArray(multiSelection)) {
            multiSelection = [];
            this.set('tree.multi-selection', multiSelection);
        }
 
        // if node is not expanded manually add to tree-multiselection
        walkTree(model, (node) => {
            if (multiSelected) {
                Ember.set(node, 'selected', true);
                arrPush(multiSelection, node);
            } else {
                Ember.set(node, 'selected', false);
                arrRemove(multiSelection, node);
            }
        });
    },
    /*
     * Observes the 'multiSelected' and put the tree in multi selection mode if true
     */
    addMultiSelectionToTreeSelection: (function() {
        let multiSelection = this.get('tree.multi-selection');
        const model = this.get('model');
        const multiSelected = this.get('multiSelected');
        if (!multiSelection) {
            return;
        }
        
        if (!Ember.isArray(multiSelection)) {
            multiSelection = [];
            this.set('tree.multi-selection', multiSelection);
        }

        // add self
        if (multiSelected) {
            arrPush(multiSelection, model);
        } else {
            arrRemove(multiSelection, model);
        }
    }).observes('multiSelected').on('init'),
    /**
     * [childrenSelectChange description]
     * @return {[type]} [description]
     */
    childrenMultiSelectionChange: function() {
        const children = this.get('model.children');
        const allSelected = children.reduce((acc, node) => {
            return acc && node.selected;
        }, true);

        const allNotSelected = children.reduce((acc, node) => {
            return acc && !node.selected;
        }, true);

        if (allNotSelected) {
            this.set('multiSelected', false);
        }

        if (allSelected) {
            this.set('multiSelected', true);
        }
    }.observes('model.children.@each.selected'),
    /**
     * [description]
     * @param  {Array}
     * @return {[type]}   [description]
     */
    iconClass: (function() {
        var icons;
        icons = [];
        if (this.get('async')) {
            if (this.get('loading')) {
                icons = icons.concat(this.iconFromModelOrDefault('nodeLoadingIconClasses'));
            } else if (!this.get('model.children')) {
                icons = this.iconFromModelOrDefault('nodeCloseIconClasses');
            } else {
                if (this.get('model.children.length') === 0) {
                    icons = icons.concat(this.iconFromModelOrDefault('nodeLeafIconClasses'));
                } else {
                    icons = this.get('expanded') ? icons.concat(this.iconFromModelOrDefault('nodeOpenIconClasses')) : icons.concat(this.iconFromModelOrDefault('nodeCloseIconClasses'));
                }
            }
        } else {
            if (this.get('leaf')) {
                icons = icons.concat(this.get('config.tree.nodeLeafIconClasses'));
            } else {
                icons = this.get('expanded') ? icons.concat(this.iconFromModelOrDefault('nodeOpenIconClasses')) : icons.concat(this.iconFromModelOrDefault('nodeCloseIconClasses'));
            }
        }
        return icons.join(" ");
    }).property('expanded', 'leaf', 'loading'),
    leafClasses: (function() {
        var _ref;
        if (this.get('leaf')) {
            return (_ref = this.get('config.tree.nodeLeafClasses')) != null ? _ref.join(" ") : void 0;
        }
    }).property('leaf'),
    hoveredActions: (function() {
        var globalHoveredActions, nodeType, types;
        globalHoveredActions = this.get('tree.hovered-actions');
        nodeType = this.get('model.nodeType');
        types = [];
        if (nodeType) {
            globalHoveredActions.forEach(function(ha) {
                if (!getProperty(ha, 'types') || !getProperty(ha, 'types').length) {
                    return types.push(ha);
                } else {
                    if (getProperty(ha, 'types').contains(nodeType)) {
                        return types.push(ha);
                    }
                }
            });
            return types;
        } else {
            return globalHoveredActions;
        }
    }).property('tree.hoveredActions', 'model.nodeType'),
    /*
     * Observes the 'model.requestReload' property, if set to true, the node's children will get reloaded
     */
    observeRequestReload: (function() {
        if (this.get('model.requestReload')) {
            this.set('model.requestReload', false);
            this.send('reloadChildren');
            return this.set('model.expanded', true);
        }
    }).observes('model.requestReload').on('init'),
    /*
     * Get the icon for the model, if set by the tree icon's metadata, otherwise use defaults configured by the tree level.
     */
    iconFromModelOrDefault: function(iconConfigName) {
        var iconsPerType, nodeType;
        nodeType = this.get('model.nodeType');
        iconsPerType = this.get('tree.icons-per-type');
        if (nodeType && iconsPerType && iconsPerType[nodeType] && iconsPerType[nodeType][iconConfigName]) {
            return iconsPerType[nodeType][iconConfigName];
        } else {
            return this.get('config.tree')[iconConfigName];
        }
    },
    actions: {
        /*
         * Expand or close the current node's children
         */
        toggle: function() {
            if (this.get('async') && !this.get('expanded') && !this.get('model.children')) {
                this.set('loading', true);
                return this.sendAction('children', this.get('model'), this);
            } else {
                return this.toggleProperty('expanded');
            }
        },
        /*
         * Reload the model's children
         */
        reloadChildren: function() {
            if (this.get('async')) {
                return this.sendAction('children', this.get('model'), this);
            }
        },
        select: function() {
            if (!this.get('selectable')) {
                return;
            }
            this.set('tree.selected', this.get('model'));
            this.get('tree').send('selectNode', this.get('model'));
        },
        /**
         * [handToggleMultiSelect toggle multiselect by hand]
         * @return {[type]} [description]
         */
        handToggleMultiSelect: function() {
            this.handToggleMultiSelect();
        }
    },
    /*
     * The name of the method to invoke in async mode to get the children of a node when expanded
     */
    children: 'getChildren',
    loadingHasChanged: (function() {
        if (!this.get('loading')) {
            return this.toggleProperty('expanded');
        }
    }).observes('loading')
});