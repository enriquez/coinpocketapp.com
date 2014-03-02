var CoinPocketApp = (function($, Bitcoin, self) {
  self.Models = {};
  self.Views = {};
  self.Controllers = {};

  Bitcoin.Entropy.collectEntropy();

  $(document).off('.data-api'); // disable bootstrap data api

  var Events = function() { };
  self.events = new Events();
  MicroEvent.mixin(self.events);

  return self;
})(jQuery, Bitcoin, {});
