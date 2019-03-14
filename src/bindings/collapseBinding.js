ko.bindingHandlers.collapse = {
    defaults: {
        toggle: ".collapse-toggle, [data-toggle='collapse']", // selector for the collapse toggle button
        content: ".collapse-content, .collapse", // selector for the collapse content
        show: false, // initially visible?
        accordion: false, // false or selector of the wrapper element for all collapsables in the accordion
        visibleClass: "collapse-visible", // additional css class for the wrapper element
        hiddenClass: "collapse-hidden" // additional css class for the wrapper element
    },

    init: function(element, valueAccessor) {
        var $wrapper = $(element),
            value = valueAccessor(),
            options = $.extend(true, {}, ko.bindingHandlers.collapse.defaults, ko.unwrap(value)),
            $toggle = $wrapper.find(options.toggle),
            $content = $wrapper.find(options.content),
            // Observable which tracks the state of the collapse can be passed as an option
            collapseState = ko.isObservable(value.collapseState) ? value.collapseState : ko.observable(options.show);

        // set the state according to the initial options
        collapseState(options.show);

        // set initial css classes
        if(options.show) {
            $wrapper.addClass(options.visibleClass);
        } else {
            $wrapper.addClass(options.hiddenClass);
        }

        // add event listeners
        $content.on('show.bs.collapse', function () {
            collapseState(true);
            $wrapper.addClass(options.visibleClass);
            $wrapper.removeClass(options.hiddenClass);
        });
        $content.on('hide.bs.collapse', function () {
            collapseState(false);
            $wrapper.removeClass(options.visibleClass);
            $wrapper.addClass(options.hiddenClass);
        });

        // init collapse
        $content.collapse( { toggle: options.show } );

        // toggle on click
        $toggle.on("click", function() {
            if(options.accordion) {
                $(options.accordion).find(".collapse.show").collapse('hide');
            }
            $content.collapse('toggle');
        });
    }
};