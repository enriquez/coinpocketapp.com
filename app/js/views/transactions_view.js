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
    this.$transactions = $("#transactions .transaction:visible");
  }

  TransactionsView.prototype.updateBlockHeight = function(height) {
    this.$container.data('currentBlockHeight', height);
  };

  TransactionsView.prototype.insertTransaction = function(txId, btc, time, blockHeight) {
    var $template = this.$transactionTemplate.clone(),
        id = 'tx-' + txId,
        selector = '#' + id;

    if ($(selector).length === 0) {
      $template.attr('id', id);
      $template.attr('data-tx-id', txId);

      // setup transaction meta data
      $template.find('[data-btc]').data('btc', btc);
      $template.find('[data-time]').data('time', time);
      $template.find('[data-block-height]').data('blockHeight', blockHeight);

      $template.formatTransaction();

      var $transactions = $('.transaction');

      $transactions.each(function(i, element) {
        var $transaction = $(element);
        if ($transaction.find('[data-time]').data('time') <= time) {
          $template.insertBefore($transaction);
          $template.fadeIn();
          return false;
        }
      });
    }
  };

  TransactionsView.prototype.transactionConfirmed = function(txId, height) {
    var $transaction = $("#tx-" + txId);
    if ($transaction.length > 0) {
      $transaction.find('[data-block-height]').data('blockHeight', height);
      $transaction.formatTransaction();
    }
  };

  Views.transactionsView = new TransactionsView();
})(jQuery, CoinPocketApp.Views);
