(function ($) {
    function toggleClass($n, cls) {
        $n.hasClass(cls) ? $n.removeClass(cls) : $n.addClass(cls);
    }

    function toggleDelete(prop_value, button_selector) {
        var dad = this.parentNode,
            el, nodes;

        toggleClass($(this), "pure-button-hidden");
        $('.field-clear-hidden-input input', dad)[0].checked = prop_value;
        toggleClass($(button_selector, dad), "pure-button-hidden");

        el = $(".field-clear-initial", dad);
        if (el.length) {
            nodes = [].slice.call(el[0].childNodes); // Creates array
            $(nodes).each(function (i, n) {
                toggleClass($(n), "deleted");
            });
        }
    }

    // Handlers
    $('.field-clear-check-button').on("click", function(e) {
        toggleDelete.call(this, true, '.field-clear-cancel');
    });
    $('.field-clear-cancel').on("click", function(e) {
        toggleDelete.call(this, false, '.field-clear-check-button');
    });
})($);
