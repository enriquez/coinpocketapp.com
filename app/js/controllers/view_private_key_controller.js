(function(pageHash, viewPrivateKeyView, Controllers) {

  function ViewPrivateKeyController() {
    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide.bind(this));
  }

  ViewPrivateKeyController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/view_private_key') {
      if (this.privateKey && this.passphrase) {
        viewPrivateKeyView.show();
        this.privateKey.bip38(this.passphrase, function(bip38) {
          viewPrivateKeyView.setPrivateKey(bip38);
        });
      } else {
        pageHash.goTo("#/");
      }
    } else {
      this.passphrase = null;
      this.privateKey = null;
      viewPrivateKeyView.hide();
    }
  };

  ViewPrivateKeyController.prototype.showPrivateKey = function(passphrase, privateKey) {
    this.passphrase = passphrase;
    this.privateKey = privateKey;
    pageHash.goTo("#/view_private_key");
  };

  Controllers.viewPrivateKeyController = new ViewPrivateKeyController();
})(CoinPocketApp.Models.pageHash, CoinPocketApp.Views.viewPrivateKeyView, CoinPocketApp.Controllers);
