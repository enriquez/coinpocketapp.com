(function(window, Models) {

  function Browser() {
    var self = this;

    self._isMobileSafariStandalone = function() {
      return self.isMobileSafari() && window.navigator.standalone;
    };

  }

  Browser.prototype.isChromeiOS = function() {
    return (/CriOS\/\S+ Mobile\/\S+ Safari\//).test(window.navigator.userAgent);
  };

  Browser.prototype.isMobileSafari = function() {
    return (/Version\/\S+ Mobile\/\w+ Safari\//).test(window.navigator.userAgent);
  };

  Browser.prototype.canScanCode = function() {
    return (this.isMobileSafari() || this.isChromeiOS()) && !this._isMobileSafariStandalone();
  };

  Browser.prototype.hasCryptoGetRandomValues = function() {
    var crypto = window.crypto || window.msCrypto;

    if (crypto && crypto.getRandomValues) {
      return true;
    } else {
      return false;
    }
  };

  Browser.prototype.canUseLocalStorage = function() {
    var result = true;

    try {
      localStorage.setItem('localStorageCheck', '');
    } catch(e) {
      result = false;
    }

    return result;
  };

  Models.browser = new Browser();
})(window, CoinPocketApp.Models);
