var CoinPocketApp = (function($, Bitcoin, self) {
  self.Models = {};
  self.Views = {};
  self.Controllers = {};

  Bitcoin.collectEntropy();

  $(document).off('.data-api'); // disable bootstrap data api

  return self;
})(jQuery, Bitcoin, {});
