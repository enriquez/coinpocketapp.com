// Friendly XSS with blockchain.info for AJAX requests
var BlockChainInfo = (function(self, $) {

  self.rawaddr = function(address, hollaback) {
    var endPoint = 'http://blockchain.info/rawaddr/' + address;
    var yql = "select * from json where url=\"" + endPoint + "\"";
    $.getJSON("https://query.yahooapis.com/v1/public/yql", {
      q: yql,
      format: 'json',
      jsonCompat: 'new'
    }, function(data) {
      hollaback(data.query.results.json);
    });
  };

  return self;
})({}, jQuery);
