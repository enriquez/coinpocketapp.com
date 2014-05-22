(function($, Views) {

  function BackupView() {
    var self = this;
    self.$container = $("#backup");
    self.$viewEncryptedPrivatedKeyButton = $("#backup-view-encrypted-private-key");

    self.$viewEncryptedPrivatedKeyButton.click(function(e) {
      self.trigger('viewEncryptedPrivateKeyButton.click');
    });
  }

  BackupView.prototype.show = function() {
    this.$container.show();
  };

  BackupView.prototype.hide = function() {
    this.$container.hide();
  };

  MicroEvent.mixin(BackupView);
  Views.backupView = new BackupView();
})(jQuery, CoinPocketApp.Views);
