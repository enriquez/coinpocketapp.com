(function(Bitcoin, Models) {
  var self = Models.Entropy = function() {
    var self = this;

    Bitcoin.Entropy.onEntropyProgress(function(progress) {
      self.trigger('entropy.progress', progress);
    });

    Bitcoin.Entropy.onEntropySeeded(function() {
      self.trigger('entropy.seeded');
    });
  };

  MicroEvent.mixin(Models.Entropy);

  self.prototype.progress = function() {
    return Bitcoin.Entropy.entropyProgress();
  };

  self.prototype.isReady = function() {
    return Bitcoin.Entropy.entropyIsReady();
  };

})(Bitcoin, CoinPocketApp.Models);
