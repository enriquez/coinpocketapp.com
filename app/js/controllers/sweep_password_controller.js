(function(pageHash, sweepPasswordView, sweepConfirmController, Controllers) {

  function SweepPasswordController() {
    var self = this;

    self.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', self.showOrHide.bind(self));

    sweepPasswordView.bind('nextButton.click', self.nextButtonClicked.bind(self));
  }

  SweepPasswordController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/sweep_password') {
      if (this.privateKey) {
        sweepPasswordView.show();
      } else {
        pageHash.goTo('#/');
      }
    } else {
      this.privateKey = null;
      sweepPasswordView.hide();
    }
  };

  SweepPasswordController.prototype.needsDecryption = function(privateKey) {
    this.privateKey = privateKey;
    pageHash.goTo('#/sweep_password');
  };

  SweepPasswordController.prototype.nextButtonClicked = function() {
    var self = this;

    var password = sweepPasswordView.$passwordInput.val();

    sweepPasswordView.loading();
    self.privateKey.bip38decrypt(password, function(result) {
      if (result.error) {
        sweepPasswordView.validationMessage(result.error);
        sweepPasswordView.doneLoading();
      } else {
        sweepConfirmController.confirmSweep(self.privateKey);
      }
    });
  };

  Controllers.sweepPasswordController = new SweepPasswordController();
})(CoinPocketApp.Models.pageHash, CoinPocketApp.Views.sweepPasswordView, CoinPocketApp.Controllers.sweepConfirmController, CoinPocketApp.Controllers);
