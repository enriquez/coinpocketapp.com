(function(browser, Controllers, $) {

  function BrowserController() {

    if (!browser.isMobileSafari()) {
      $('.ios-only').hide();
    }

  }

  Controllers.browserController = new BrowserController();
})(CoinPocketApp.Models.browser, CoinPocketApp.Controllers, jQuery);
