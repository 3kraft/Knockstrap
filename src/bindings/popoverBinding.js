var popoverDomDataTemplateKey = '__popoverTemplateKey__';

ko.bindingHandlers.popover = {

    init: function (element) {
        var $element = $(element);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if ($element.data('bs.popover')) {
                $element.popover('dispose');
            }
        });
    },

    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element),
            value = ko.unwrap(valueAccessor()),
            options = (!value.options && !value.template ? ko.utils.unwrapProperties(value) : ko.utils.unwrapProperties(value.options)) || {};

        if (value.template) {
            // use unwrap to track dependency from template, if it is observable
            ko.unwrap(value.template);

            var id = ko.utils.domData.get(element, popoverDomDataTemplateKey);

            var renderPopoverTemplate = function (eventObject) {

                if (eventObject && eventObject.type === 'inserted') {
                       $element.off('shown.bs.popover');
                }
                
                var template = ko.unwrap(value.template),
                    internalModel;

                if(typeof template === 'string') {
                    internalModel = { 
                        $$popoverTemplate: $.extend({
                            name: value.template,
                            data: value.data
                        }, value.templateOptions) 
                    };

                } else {
                    internalModel = {
                        $$popoverTemplate: value.template 
                    };
                }
                
                var childContext = bindingContext.createChildContext(bindingContext.$rawData, null, function(context) {
                    ko.utils.extend(context, internalModel);
                });

                ko.applyBindingsToDescendants(childContext, document.getElementById(id));
            };

            // if there is no generated id - popover executes first time for this element
            if (!id) {
                id = ko.utils.uniqueId('ks-popover-');
                ko.utils.domData.set(element, popoverDomDataTemplateKey, id);

                // place template rendering after popover is shown, because we don't have root element for template before that
                $element.on('shown.bs.popover inserted.bs.popover', renderPopoverTemplate);
            }

            options.content = '<div id="' + id + '" ><div data-bind="template: $$popoverTemplate"></div></div>';
            options.html = true;
        }

        var popoverData = $element.data('bs.popover');

        if (!popoverData) {
            $element.popover(options);

            // Check options whether the popover should be closed on click automatically.
            // - closeOnClickOutside -> clicks inside the popover are ignored.
            // - closeOnClick -> all clicks will close the popover
            var autoClose = (options.closeOnClick && options.closeOnClick === true) || (options.closeOnClickOutside && options.closeOnClickOutside === true);
            if(autoClose) {
                // bind a custom event when the popover is shown.
                $element.on('show.bs.popover', function () {
                    $(this).addClass('popover-trigger');
                    $('body').on("click.closePopover", function () {
                        var clickOnPopover = options.closeOnClick ? false : $(event.target).closest(".popover.show").length > 0;
                        var clickOnPopoverTrigger = $(event.target).closest(".popover-trigger").length > 0;
                        if (!clickOnPopover && !clickOnPopoverTrigger) {
                            $element.popover('hide');
                        }
                    });
                });

                // remove the custom event when the popover is hidden.
                $element.on('hide.bs.popover', function () {
                    $('body').off("click.closePopover");
                    $(this).removeClass('popover-trigger');
                });
            }

            $element.on('shown.bs.popover inserted.bs.popover', function () {
                (options.container ? $(options.container) : $element.parent()).one('click', '[data-dismiss="popover"]', function () {
                    $element.popover('hide');
                });
            });
        } else {
            ko.utils.extend(popoverData.options, options);
            if(popoverData.options.content) {
                $element.popover('show');
            } else {
                $element.popover('hide');
            }
        }
    }
};
