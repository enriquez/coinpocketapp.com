(function($, Views) {

  function TransactionsView() {
    this.$container = $('#transactions');
    this.$transactionTemplate = $("#transaction-template");
  }

  TransactionsView.prototype.insertNewTransaction = function(transaction) {
    var $template = this.$transactionTemplate.clone(),
        btc;

    $template.attr('id', '');

    // TODO: move this somewhere else and display a nicer date/time format
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        date = new Date(transaction.time * 1000);
    $template.find('[data-epoch]').data('epoch', transaction.time);
    $template.find('[data-epoch]').find('span.date').text(months[date.getMonth()]);
    $template.find('[data-epoch]').find('span.time').text(date.getHours() + ":" + date.getMinutes());


    $template.find('[data-block-height]').data('blockHeight', transaction.blockHeight);

    if (transaction.amountDelta > 0.0) {
      $template.addClass('transaction-credit');
      btc = (transaction.amountDelta) / 100000000.0;
    } else if (transaction.amountDelta < 0) {
      $template.addClass('transaction-debit');
      btc = (transaction.amountDelta * -1) / 100000000.0;
    } else {
      btc = 0;
    }

    // TODO: move this somewhere else
    $template.find('[data-btc]').data('btc', btc).text(btc + " BTC");

    this.$container.append($template);
    $template.fadeIn();
  };

  Views.transactionsView = new TransactionsView();

})(jQuery, CoinPocketApp.Views);
