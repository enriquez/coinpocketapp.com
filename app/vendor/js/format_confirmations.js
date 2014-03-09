(function($) {

  $.fn.formatConfirmations = function(options) {
    var settings = $.extend({
      containerSelector : '#transactions'
    }, options);

    return this.each(function() {
      var blockHeight = $(this).data('blockHeight'),
          currentBlockHeight = $(settings.containerSelector).data('currentBlockHeight');

      if (blockHeight && currentBlockHeight) {
        var confirmations = currentBlockHeight - blockHeight + 1;
        if (confirmations > 1) {
          $(this).text(confirmations.toString() + " confirmations");
        } else if (confirmations === 1) {
          $(this).text("1 confirmation");
        } else if (confirmations === 0) {
          $(this).text('unconfirmed');
        } else {
          $(this).text('');
        }
      } else {
        $(this).text('unconfirmed');
      }
    });
  };

})(jQuery);
