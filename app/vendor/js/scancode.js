(function($) {

  $.fn.scancode = function(options) {
    var settings = $.extend({
      dataAttr : 'scancode-callback-path'
    }, options);

    return this.each(function() {
      $(this).click(function(e) {
        e.preventDefault();
        var protocol = document.location.protocol;

        // check for google chrome on iOS
        if ((/CriOS\/\S+ Mobile\/\S+ Safari\//).test(window.navigator.userAgent)) {
          if (protocol === 'https:') {
            protocol = 'googlechromes:';
          } else {
            protocol = 'googlechrome:';
          }
        }

        var callbackUrl = protocol + "//" + document.location.host + $(this).data(settings.dataAttr);
        var scanCodeUrl = "scancode://scan?callback=" + encodeURIComponent(callbackUrl);
        window.location = scanCodeUrl;
      });
    });
  };

})(jQuery);
