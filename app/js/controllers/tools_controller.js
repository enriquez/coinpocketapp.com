(function(wallet, pageHash, toolsView, bitcoinWorker, Controllers) {

  function ToolsController() {
    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide);

    wallet.bind('addressCheck.updated', function(data) {
      toolsView.setAmount(wallet.balanceBTC());
    });    
  }

  ToolsController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/tools') {
      toolsView.show();

      //toolsView.setAddress('test');

      if (pageParams.params.code) {
        bitcoinWorker.async("parseCode", [pageParams.params.code], function(result) {
          if (result.address) {
            toolsView.setAddress(result.address);

            wallet.fetchUnspentOutputs(result.address, null, 'addressCheck.updated');
          }

          pageHash.goTo("#/tools"); // clear qr code data from url
        });
      }      
    } else {
      toolsView.hide();
    }
  };

  Controllers.toolsController = new ToolsController();
})(CoinPocketApp.Models.wallet, CoinPocketApp.Models.pageHash, CoinPocketApp.Views.toolsView, CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Controllers);
