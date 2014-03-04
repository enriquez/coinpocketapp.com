(function(Models) {

  var self = Models.PageHash = function() {
    window.onhashchange = Models.PageHash.updatePage;
  };

  MicroEvent.mixin(Models.PageHash);

  self.pages = [
    "#/",
    "#/send",
    "#/receive"
  ];

  // Warning: params are not sanitized.
  self.pageParamsForHash = function(hash) {
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

  self.updatePage = function() {
    var hash = window.location.hash,
        instance = Models.PageHash.pageHash,
        currentPage = self.pageParamsForHash(hash);

    instance.currentPage = currentPage;
    instance.trigger("pageHash.pageChanged", currentPage);
  };

  Models.PageHash.pageHash = new Models.PageHash();
  Models.PageHash.pageHash.currentPage = Models.PageHash.pageParamsForHash(window.location.hash);

})(CoinPocketApp.Models);
