var BlockChainInfo = (function(self, $) {

  function getJSONForPath(path, hollaback) {
    var url = 'http://blockchain.info' + path;
    var yql = "select * from json where url=\"" + url + "\"";
    $.getJSON("https://query.yahooapis.com/v1/public/yql", {
      q: yql,
      format: 'json',
      jsonCompat: 'new'
    }, function(data) {
      hollaback(data.query.results.json);
    });
  }

  self.rawaddr = function(address, hollaback) {
    getJSONForPath('/rawaddr/' + address, hollaback);
  };

  self.latestblock = function(hollaback) {
    getJSONForPath('/latestblock', hollaback);
  };

  return self;
})({}, jQuery);
