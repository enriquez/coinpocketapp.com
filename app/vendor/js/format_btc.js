(function($) {

  $.fn.formatBTC = function(options) {

    return this.each(function() {
      var btc = $(this).data('btc'),
          rate = $(this).data('rate') || 1,
          units = $(this).data('units') || 'btc';

      if (btc < 0) {
        btc = btc * -1;
      }

      if (units === 'btc') {
        $(this).text(btc.toString() + " BTC");
      } else if (units === 'usd') {
        var conversion = btc * rate;
        $(this).text("$" + conversion.toFixed(2));
      }
    });
  };

})(jQuery);
