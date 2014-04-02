(function(BlockChainInfo, connectionStatusView, Controllers) {

  function ConnectionStatusController() {
    this.socket = new BlockChainInfo.WebSocket();
    this.socket.onReconnectFailure(function() {
      connectionStatusView.showFailure();
    });
    this.socket.onConnectSuccess(function() {
      connectionStatusView.hide();
    });
  }

  Controllers.connectionStatusController = new ConnectionStatusController();
})(BlockChainInfo, CoinPocketApp.Views.connectionStatusView, CoinPocketApp.Controllers);
