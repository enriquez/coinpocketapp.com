(function(pageHash, privateKeyPasswordView, PrivateKey, viewPrivateKeyController, Controllers) {

  function PrivateKeyPasswordController() {
    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide);

    privateKeyPasswordView.bind('nextButton.click', function() {
      privateKeyPasswordView.clearValidations();
      var password = privateKeyPasswordView.$passwordInput.val();

      if (password) {
        PrivateKey.fromWallet(password, function(result) {
          if (result.error) {
            privateKeyPasswordView.validationMessage(result.error);
          } else {
            var privateKey = result;
            viewPrivateKeyController.showPrivateKey(password, privateKey);
          }
        });
      } else {
        privateKeyPasswordView.validationMessage('Invalid Password');
      }

    });
  }

  PrivateKeyPasswordController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/private_key_password') {
      privateKeyPasswordView.show();
    } else {
      privateKeyPasswordView.hide();
    }
  };

  Controllers.privateKeyPasswordController = new PrivateKeyPasswordController();
})(CoinPocketApp.Models.pageHash, CoinPocketApp.Views.privateKeyPasswordView, CoinPocketApp.Models.PrivateKey, CoinPocketApp.Controllers.viewPrivateKeyController, CoinPocketApp.Controllers);
