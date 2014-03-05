(function($) {

  $.fn.scancode = function(options) {
    var settings = $.extend({
      dataAttr : 'scancode-callback-path'
    }, options);

    return this.each(function() {
      $(this).click(function(e) {
        e.preventDefault();
        var callbackUrl = document.location.protocol + "//" + document.location.host + $(this).data(settings.dataAttr);
        var scanCodeUrl = "scancode://scan?callback=" + encodeURIComponent(callbackUrl);
        window.location = scanCodeUrl;
      });
    });
  };

})(jQuery);
