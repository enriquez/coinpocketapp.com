(function($, Views) {

  function TransactionsView() {
    this.$container = $('#transactions');
    this.$transactionTemplate = $("#transaction-template");
  }

  TransactionsView.prototype.insertNewTransaction = function(transaction) {
    var $template = this.$transactionTemplate.clone(),
        btc;

    $template.attr('id', '');

    // move this somewhere else
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        date = new Date(transaction.time * 1000);
    $template.find('[data-epoch]').data('epoch', transaction.time);
    $template.find('[data-epoch]').find('span.date').text(months[date.getMonth()]);
    $template.find('[data-epoch]').find('span.time').text(date.getHours() + ":" + date.getMinutes());


    $template.find('[data-block-height]').data('blockHeight', transaction.blockHeight);

    if (transaction.amountDelta > 0) {
      $template.addClass('transaction-credit');
      btc = transaction.amountDelta;
    } else if (transaction.amountDelta < 0) {
      $template.addClass('transaction-debit');
      btc = transaction.amountDelta * -1;
    } else {
      btc = 0;
    }

    $template.find('[data-btc]').data('btc', btc).text(btc);

    this.$container.prepend($template);
    $template.fadeIn();
  };

  Views.transactionsView = new TransactionsView();

})(jQuery, CoinPocketApp.Views);
