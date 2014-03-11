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

  Entropy.prototype.addCryptoStrongEntropy = function() {
    var ab = new Uint32Array(32);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(ab);
      sjcl.random.addEntropy(ab, 1024, "crypto.getRandomValues");
    } else if (window.msCrypto && window.msCrypto.getRandomValues) {
      window.msCrypto.getRandomValues(ab);
      sjcl.random.addEntropy(ab, 1024, "crypto.getRandomValues");
    } else {
      throw "Browser not supported: getRandomValues unavailable";
    }
  };

  MicroEvent.mixin(Entropy);
  Models.entropy = new Entropy();

})(sjcl, CoinPocketApp.Models);
