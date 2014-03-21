(function(window, Models) {

  function PageHash() {
    var self = this;

    self.currentPage = PageHash.pageParamsForHash(window.location.hash);

    window.onhashchange = function() {
      var hash = window.location.hash,
          currentPage = PageHash.pageParamsForHash(hash);

      self.currentPage = currentPage;
      self.trigger("pageHash.pageChanged", currentPage);
    };
  }

  PageHash.prototype.goTo = function(newPageHash) {
    window.location.hash = newPageHash;
  };

  MicroEvent.mixin(PageHash);

  PageHash.pages = [
    "#/",
    "#/send",
    "#/receive",
    "#/confirmation"
  ];

  // Warning: params are not sanitized.
  PageHash.pageParamsForHash = function(hash) {
    var pageAndParams,
          params = {};

    if (hash && this.pages.indexOf(hash) > 0) {
      pageAndParams = { page: hash, params: params };
    } else if (hash && hash.indexOf("?") > 0) {
      var hashParts = hash.split("?"),
          page = hashParts[0];

      if (this.pages.indexOf(page) > 0) {
        if (hashParts.length === 2 && hashParts[1] !== '') {
          var pairs = hashParts[1].split("&");

          for(var i = 0; i < pairs.length; i++) {
            var split = pairs[i].split("=");
            var key   = decodeURIComponent(split[0]);
            var value = decodeURIComponent(split[1]);

            if (typeof split[1] === "undefined") { value = ''; }
            params[key] = value;
          }
        }
      } else {
        page = "#/";
      }

      pageAndParams = { page: page, params: params };
    } else {
      pageAndParams = { page: "#/", params: params };
    }

    return pageAndParams;
  };

  Models.PageHash = PageHash;
  Models.pageHash = new PageHash();

})(window, CoinPocketApp.Models);
