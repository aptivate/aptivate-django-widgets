/**********************************************************************
 *
 * A word limit widget - warn when widget contains more than
 * data-word-limit words
 *
 * Should work in: FF, Chrome, Safari, IE8+
 *
 * Depends on: mjp.js
 *
 **********************************************************************/
(function ($) {
    var words_text = "Words: ";

    function calculateWordCount(value) {
        var words = $.trim(value).split(" ");
        return words.length === 1 && words[0] === "" ? 0 : words.length;
    }

    // WordLimit widget
    function WordLimit(node) {
        function countWords() {
            var word_count = calculateWordCount(this.value);
            self.updateWidget(word_count);
            self.isOverLimit("over-limit", word_count > limit);
        }

        var limit = parseInt(node.getAttribute("data-word-limit") || 0,
                             10),
            self = this;

        this.node = node;
        this.widget = this.buildWordWidget(calculateWordCount(node.value), limit);

        $(node).on("input", countWords)
               .on("keyup", countWords)
               .on("change", countWords)

        return this;
    }

    WordLimit.prototype.updateWidget = function (value) {
        $(".words", this.widget)[0].innerHTML = value;
    }

    WordLimit.prototype.buildWordWidget = function (word_count, limit) {
        var widget = $("<div></div>").addClass("widget-word-limit")[0],
            removed = null;

        widget.appendChild(
            $('<span class="counter">'+words_text+' <span class="words">'+
              word_count+'</span>/'+limit+"</span>")[0]);

        removed = this.node.parentNode.replaceChild(widget, this.node);
        widget.insertBefore(removed, widget.firstChild);
        return widget;
    }

    WordLimit.prototype.isOverLimit = function (over_cls, over_limit) {
        var $wdg = $(this.widget);
        over_limit ? $wdg.addClass(over_cls) : $wdg.removeClass(over_cls);
    }


    // Init
    $(".input-word-limit").each(function (i, node) {
        new WordLimit(node);
    });

})($);
