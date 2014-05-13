(function($) {

  $.fn.panelToggle = function(options) {
    return this.each(function() {

      $(this).click(function(e) {
        e.preventDefault();

        var $panelBody = $(this).parents('.panel').find('.panel-body');
        if ($panelBody.is(':visible')) {
          $panelBody.slideUp();
          $(this).text('show details');
        } else {
          $panelBody.slideDown();
          $(this).text('hide details');
        }
      });

    });
  }

})(jQuery);
