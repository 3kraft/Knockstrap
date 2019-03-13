ko.bindingHandlers.collapse = {
    defaults: {
        toggle: ".collapse-toggle, [data-toggle]", // selector for the collapse toggle button
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
            // Observable which tracks the state of the collapsable can be passed as an option
            collapseState = ko.isObservable(value.collapseState) ? value.collapseState : ko.observable(options.show);

        // set the state according to the initial options
        collapseState(options.show);

        // Set bootstrap collapse options
        // see https://getbootstrap.com/docs/4.3/components/collapse/#options
        var collapseOptions = {
            toggle: options.show,
        };
        if(options.accordion) {
            collapseOptions.parent = options.accordion;
        }

        // init collapse
        $content.collapse(collapseOptions);

        // set initial css classes
        if(options.show) {
            $wrapper.addClass(options.visibleClass);
        } else {
            $wrapper.addClass(options.hiddenClass);
        }

        // toggle on click
        $toggle.on("click", function() {
            collapseState(!collapseState());
            $wrapper.toggleClass(options.visibleClass);
            $wrapper.toggleClass(options.hiddenClass);
            $content.collapse('toggle');
        });
    }
};