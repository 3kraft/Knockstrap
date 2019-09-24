/*jshint unused:false*/

ko.bindingHandlers.tabs = {

    defaults: {
        tabSelector: ".nav-item .nav-link",
        onShow: function (event) {},
        onShown: function (event) {},
        onHide: function (event) {},
        onHidden: function (event) {}
    },

    init: function (element, valueAccessor) {

        var options = $.extend(true, {}, ko.bindingHandlers.tabs.defaults, valueAccessor());

        // init each tab and bind event handlers
        $(element).find(options.tabSelector).each(function() {
            $(this).on('click', function (event) {
                event.preventDefault();
                $(this).tab('show');
            })
                .on('show.bs.tab', options.onShow)
                .on('shown.bs.tab', options.onShown)
                .on('hide.bs.tab', options.onHide)
                .on('hidden.bs.tab', options.onHidden);
        });
    },
    update: function (element, valueAccessor) {

        var options = $.extend(true, {}, ko.bindingHandlers.tabs.defaults, valueAccessor());

        // show the first tab pane with an error.
        $(element).find(options.tabSelector).each(function() {
            var $tab = $(this);
            var paneId = $tab.attr('href');
            if (typeof paneId !== typeof undefined && paneId !== false) {
                var $pane = $(paneId);
                var $errors = $pane.find(".validationMessage").filter(function( index, element ) {
                    return $(element).text().length > 0;
                });
                if($errors.length > 0) {
                    $tab.tab('show');
                    return false;
                }
            }
        });
    }
};