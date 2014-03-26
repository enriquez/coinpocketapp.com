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

        var iTunesUrl = 'https://itunes.apple.com/us/app/scan-code-qr-code-reader/id828167977?ls=1&mt=8';
        var time = (new Date()).getTime();
        setTimeout(function(){
          var now = (new Date()).getTime();

          if((now - time)<400) {
            if(confirm('You do not have the Scan Code app installed. Launch the App Store to download it now?')){
              document.location = iTunesUrl;
            }
          }
        }, 300);
      });
    });
  };

})(jQuery);
