(function(sjcl, Models) {
  var self = Models.Entropy = function() {
    var self = this;

    sjcl.random = new sjcl.prng(Models.Entropy.paranoiaLevel);
    sjcl.random.startCollectors();

    sjcl.random.addEventListener('progress', function(progress) {
      self.trigger('entropy.progress', progress);
    });

    sjcl.random.addEventListener('seeded', function(bits) {
      self.trigger('entropy.seeded');
    });
  };

  MicroEvent.mixin(Models.Entropy);

  self.paranoiaLevel = self.paranoiaLevel || 10;
  self.entropy = new Models.Entropy();

  self.prototype.progress = function() {
    return sjcl.random.getProgress(self.paranoiaLevel);
  };

  self.prototype.isReady = function() {
    return sjcl.random.isReady();
  };

  self.prototype.randomWords = function(words) {
    return sjcl.random.randomWords(words);
  };

})(sjcl, CoinPocketApp.Models);
