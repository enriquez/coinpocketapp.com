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
    var self = this;
    self.$container = $('#transactions');
    self.$transactionTemplate = $("#transaction-template");
    self.$loadMore = $("#load-more");
    self.$loadMoreButton = $("#load-more-button");

    self.$loadMoreButton.click(function(e) {
      e.preventDefault();
      self.trigger('loadButton.clicked');
    });
  }

  TransactionsView.prototype.updateBlockHeight = function(height) {
    this.$container.data('currentBlockHeight', height);
    $('[data-block-height]').formatConfirmations();
  };

  TransactionsView.prototype.insertTransaction = function(transaction) {
    var $template = this.$transactionTemplate.clone(),
        id = 'tx-' + transaction.id,
        selector = '#' + id;

    if ($(selector).length === 0) {
      $template.attr('id', id);
      $template.attr('data-tx-id', transaction.id);

      // setup transaction meta data
      $template.find('[data-btc]').data('btc', transaction.amountDeltaBTC());
      $template.find('[data-time]').data('time', transaction.time);
      $template.find('[data-block-height]').data('blockHeight', transaction.blockHeight);

      var inputsTotal = 0;
      for (var i=0; i<transaction.inputs.length; i++) {
        var input = transaction.inputs[i];
        var $inputTemplate = $template.find('.inputs-row-template').clone();
        $inputTemplate.removeClass('inputs-row-template');
        $inputTemplate.find('.inputs-address').text(input.addr);
        $inputTemplate.find('.inputs-btc').text((input.value / 100000000).toFixed(8) + " BTC");

        $template.find('.transaction-inputs').prepend($inputTemplate);
        $inputTemplate.show();

        inputsTotal += input.value;
      }

      var outputsTotal = 0;
      for (var j=0; j<transaction.outputs.length; j++) {
        var output = transaction.outputs[j];
        var $outputTemplate = $template.find('.outputs-row-template').clone();
        $outputTemplate.removeClass('outputs-row-template');
        $outputTemplate.find('.outputs-address').text(output.addr);
        $outputTemplate.find('.outputs-btc').text((output.value / 100000000).toFixed(8) + " BTC");

        $template.find('.transaction-outputs').prepend($outputTemplate);
        $outputTemplate.show();

        outputsTotal += output.value;
      }

      $template.find('.total-inputs-btc').text((inputsTotal / 100000000).toFixed(8) + " BTC");
      $template.find('.total-outputs-btc').text((outputsTotal / 100000000).toFixed(8) + " BTC");
      $template.find('.transaction-fee').text(parseFloat(((inputsTotal - outputsTotal) / 100000000).toFixed(8)) + " BTC");

      $template.formatTransaction();

      $template.find('.toggle-input-row').click(function(e) {
        e.preventDefault();
        var $inputsRow = $template.find('.inputs-row');
        if ($inputsRow.is(':visible')) {
          $inputsRow.fadeOut();
          $(this).text('show');
        } else {
          $inputsRow.fadeIn();
          $(this).text('hide');
        }
      });

      $template.find('.toggle-output-row').click(function(e) {
        e.preventDefault();
        var $outputRow = $template.find('.outputs-row');
        if ($outputRow.is(':visible')) {
          $outputRow.fadeOut();
          $(this).text('show');
        } else {
          $outputRow.fadeIn();
          $(this).text('hide');
        }
      });

      $template.find('.transaction-preview').click(function(e) {
        e.preventDefault();
        $(this).parent().find('.transaction-details').fadeToggle();
      });

      var $transactions = $('.transaction');

      $transactions.each(function(i, element) {
        var $transaction = $(element);
        if ($transaction.find('[data-time]').data('time') <= transaction.time) {
          $template.insertBefore($transaction);
          $template.fadeIn();
          return false;
        }
      });
    } else {
      $(selector).find('[data-block-height]').data('blockHeight', transaction.blockHeight);
      $(selector).formatTransaction();
    }
  };

  TransactionsView.prototype.transactionConfirmed = function(txId, height) {
    var $transaction = $("#tx-" + txId);
    if ($transaction.length > 0) {
      $transaction.find('[data-block-height]').data('blockHeight', height);
      $transaction.formatTransaction();
    }
  };

  TransactionsView.prototype.hideLoadMore = function() {
    this.$loadMore.hide();
    this.$loadMoreButton.button('reset');
  };

  TransactionsView.prototype.showLoadMore = function() {
    this.$loadMore.show();
  };

  TransactionsView.prototype.loadMoreLoading = function() {
    this.$loadMoreButton.button('loading');
  };

  TransactionsView.prototype.loadMoreDoneLoading = function() {
    this.$loadMoreButton.button('reset');
  };

  TransactionsView.prototype.visibleTransactionCount = function() {
    return $(".transaction:visible").length;
  };

  TransactionsView.prototype.setUnits = function(rate, units) {
    var elements = this.$container.find('[data-btc]');
    elements.data('rate', rate);
    elements.data('units', units);
    elements.formatBTC();
  };

  MicroEvent.mixin(TransactionsView);
  Views.transactionsView = new TransactionsView();
})(jQuery, CoinPocketApp.Views);
