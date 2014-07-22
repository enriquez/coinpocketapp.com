var CoinPocketApp = (function($, self) {
  self.VERSION = 'v1.3.1';
  $('.coin-pocket-version').text(self.VERSION);

  self.Models = {};
  self.Views = {};
  self.Controllers = {};

  $(document).off('.data-api'); // disable bootstrap data api
  $('.hidden').hide().removeClass('hidden'); // initialize hidden elements

  return self;
})(jQuery, {});
