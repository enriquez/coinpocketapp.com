(function(Bitcoin, Models) {
  var self = Models.Entropy = function() {
    var self = this;

    Bitcoin.onEntropyProgress(function(progress) {
      self.trigger('entropy.progress', progress);
    });

    Bitcoin.onEntropySeeded(function() {
      self.trigger('entropy.seeded');
    });
  };

  MicroEvent.mixin(Models.Entropy);

  self.prototype.progress = function() {
    return Bitcoin.entropyProgress();
  };

  self.prototype.isReady = function() {
    return Bitcoin.entropyIsReady();
  };

})(Bitcoin, CoinPocketApp.Models);
