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
    }
};