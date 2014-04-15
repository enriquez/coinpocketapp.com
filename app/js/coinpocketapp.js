var CoinPocketApp = (function($, self) {
  self.VERSION = 'v1.0.0-beta1';
  $('.coin-pocket-version').text(self.VERSION);

  self.Models = {};
  self.Views = {};
  self.Controllers = {};

  $(document).off('.data-api'); // disable bootstrap data api

  return self;
})(jQuery, {});
