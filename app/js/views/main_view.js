(function($, Views) {

  function MainView() {
    this.$container = $("#main");
  }

  MainView.prototype.show = function() {
    this.$container.fadeIn();
  };

  MainView.prototype.hide = function() {
    this.$container.hide();
  };

  Views.mainView = new MainView();
})(jQuery, CoinPocketApp.Views);
