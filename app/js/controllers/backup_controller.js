(function(backupView, Controllers) {

  function BackupController() {
    var hasBackup = localStorage.getItem('hasBackup');

    if (hasBackup) {
      backupView.hide();
    } else {
      backupView.show();
    }

    backupView.bind('viewEncryptedPrivateKeyButton.click', function() {
      localStorage.setItem('hasBackup', true);
      backupView.hide();
    });
  }

  Controllers.backupController = new BackupController();
})(CoinPocketApp.Views.backupView, CoinPocketApp.Controllers);
