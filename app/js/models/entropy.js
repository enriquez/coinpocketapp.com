(function(sjcl, Models) {

  function Entropy() {
    var self = this;

    sjcl.random = new sjcl.prng(Entropy.paranoiaLevel);
    sjcl.random.startCollectors();

    sjcl.random.addEventListener('progress', function(progress) {
      self.trigger('entropy.progress', progress);
    });

    sjcl.random.addEventListener('seeded', function(bits) {
      self.trigger('entropy.seeded');
    });
  }

  Entropy.paranoiaLevel = 10;

  Entropy.prototype.progress = function() {
    return sjcl.random.getProgress(self.paranoiaLevel);
  };

  Entropy.prototype.isReady = function() {
    return sjcl.random.isReady();
  };

  Entropy.prototype.randomWords = function(words) {
    return sjcl.random.randomWords(words);
  };

  MicroEvent.mixin(Entropy);
  Models.entropy = new Entropy();

})(sjcl, CoinPocketApp.Models);
