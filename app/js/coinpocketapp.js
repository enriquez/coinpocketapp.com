var CoinPocketApp = (function($, self) {
  self.Models = {};
  self.Views = {};
  self.Controllers = {};

  $(document).off('.data-api'); // disable bootstrap data api

  var Events = function() { };
  self.events = new Events();
  MicroEvent.mixin(self.events);

  return self;
})(jQuery, {});
