odoo.define('web.AppsMenu', function (require) {
"use strict";

var Widget = require('web.Widget');

var AppsMenu = Widget.extend({
    template: 'AppsMenu',
    events: {
        'click .o_app': '_onAppsMenuItemClicked',
        'click .sub-app': '_onSubmenuItemClicked',
        'mouseenter .o_app': '_onAppsMenuItemMouseEnter',
        'mouseleave .o_app': '_onAppsMenuItemMouseLeave',
    },
    /**
     * @override
     * @param {web.Widget} parent
     * @param {Object} menuData
     * @param {Object[]} menuData.children
     */
    init: function (parent, menuData) {
        this._super.apply(this, arguments);
        this._activeApp = undefined;

        this._apps = _.map(menuData.children, function (appMenuData) {
            var iconUrl = appMenuData.web_icon !== false ? appMenuData.web_icon.replace(",", "/") : "/base/static/description/icon.png";

            appMenuData.children.forEach(submenu => {
               if (submenu.action) {
                   var actionNumber = submenu.action.split(',')[1];
                   submenu.action = actionNumber;
               }

               return submenu;
            });

            return {
                actionID: parseInt(appMenuData.action.split(',')[1]),
                menuID: appMenuData.id,
                name: appMenuData.name,
                xmlID: appMenuData.xmlid,
                webIcon: iconUrl,
                submenus: appMenuData.children
            };
        });
    },

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    /**
     * @returns {Object[]}
     */
    getApps: function () {
        return this._apps;
    },
    /**
     * Open the first app in the list of apps
     */
    openFirstApp: function () {
        if (!this._apps.length) {
            return
        }
        var firstApp = this._apps[0];
        this._openApp(firstApp);
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     * @param {Object} app
     */
    _openApp: function (app) {
        this._setActiveApp(app);
        this.trigger_up('app_clicked', {
            action_id: app.actionID,
            menu_id: app.menuID,
        });
    },
    /**
     * @private
     * @param {Object} app
     */
    _setActiveApp: function (app) {
        var $oldActiveApp = this.$('.o_app.active');
        $oldActiveApp.removeClass('active');
        var $newActiveApp = this.$('.o_app[data-action-id="' + app.actionID + '"]');
        $newActiveApp.addClass('active');
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Called when clicking on an item in the apps menu.
     *
     * @private
     * @param {MouseEvent} ev
     */
    _onAppsMenuItemClicked: function (ev) {
        var $target = $(ev.currentTarget);
        var actionID = $target.data('action-id');
        var menuID = $target.data('menu-id');
        var app = _.findWhere(this._apps, { actionID: actionID, menuID: menuID });
        this._openApp(app);
    },
    /**
     * Handles the show of app's dropdown menu when the app is hovered over.
     * 
     * @private
     * @param {Event} ev Fired when a menu app is hovered over
     */
    _onAppsMenuItemMouseEnter: function(ev) {
        var target = ev.currentTarget;
        var relatedDropdown = target.nextElementSibling;

        if (relatedDropdown) {
            relatedDropdown.classList.add("show");

            // Attach event listener to the dropdown menu itself.
            relatedDropdown.addEventListener("mouseenter", function() {
                relatedDropdown.classList.add("show");
            });
            relatedDropdown.addEventListener("mouseleave", function() {
                relatedDropdown.classList.remove("show");
            });
        }
    },
    /**
     * Handles hiding the app's dropdown menu when the mouse leaves the app's area.
     * 
     * @private
     * @param {Event} ev Fired when the mouse leaves the menu app's area
     */
    _onAppsMenuItemMouseLeave: function(ev) {
        var target = ev.currentTarget;
        var relatedDropdown = target.nextElementSibling;

        if (relatedDropdown) {
            relatedDropdown.classList.remove("show");
        }
    },
    /**
     * Handles clicking the submenu apps (dropdown menu of main apps).
     * 
     * @private
     * @param {Event} ev Fired when a submenu app is clicked
     */
    _onSubmenuItemClicked: function(ev) {
        var $target = $(ev.currentTarget);
        var menuID = $target.data('menu-id');
        var app = _.findWhere(this._apps, { menuID: menuID });
        this._openApp(app);
    }

});

return AppsMenu;
});
