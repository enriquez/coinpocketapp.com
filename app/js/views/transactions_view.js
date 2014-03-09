(function($, Views) {

  $.fn.formatTransaction = function() {
    return this.each(function() {
      var $transaction = $(this),
          $time = $transaction.find('[data-time]'),
          $btc = $transaction.find('[data-btc]'),
          $blockHeight = $transaction.find('[data-block-height]'),
          $container = $("#transactions");

      var btc = $btc.data('btc'),
          blockHeight = $blockHeight.data('blockHeight');

      if (blockHeight) {
        $transaction.removeClass('transaction-unconfirmed');
      } else {
        $transaction.addClass('transaction-unconfirmed');
      }

      if (btc > 0) {
        $transaction.addClass("transaction-credit");
      } else if (btc < 0) {
        $transaction.addClass("transaction-debit");
      }

      $time.formatDate();
      $blockHeight.formatConfirmations();
      $btc.formatBTC();
    });
  };

  function TransactionsView() {
    this.$container = $('#transactions');
    this.$transactionTemplate = $("#transaction-template");
  }

  TransactionsView.prototype.insertNewTransaction = function(transaction) {
    var $template = this.$transactionTemplate.clone();

    $template.attr('id', '');

    // setup transaction meta data
    $template.find('[data-btc]').data('btc', transaction.amountDelta / 100000000.0);
    $template.find('[data-time]').data('time', transaction.time * 1000);
    $template.find('[data-block-height]').data('blockHeight', transaction.blockHeight);

    // format the transaction based on meta data, add to DOM, fade in.
    $template.formatTransaction();
    this.$container.append($template);
    $template.fadeIn();
  };

  TransactionsView.prototype.updateBlockHeight = function(height) {
    this.$container.data('currentBlockHeight', height);
  };

  Views.transactionsView = new TransactionsView();
})(jQuery, CoinPocketApp.Views);
