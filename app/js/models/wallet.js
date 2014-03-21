(function(BlockChainInfo, keyPair, entropy, bitcoinWorker, Models) {

  function Wallet() {
    this.unspentOutputs = {};

    this._btcToSatoshis = function(btc) {
      return btc * 100000000;
    };

    this._satoshisToBtc = function(satoshis) {
      return satoshis / 100000000;
    };

    this._eachUnspentOutput = function(action) {
      for (var id in this.unspentOutputs) {
        var unspentOutput = this.unspentOutputs[id];
        // explicitly return false to break
        if (action(unspentOutput) === false) {
          break;
        }
      }
    };
  }

  Wallet.prototype.updateUnspentOutputs = function(unspentOutputs) {
    for (var i=0; i<unspentOutputs.length; i++) {
      var unspentOutput = unspentOutputs[i];
      var id = unspentOutput.tx_hash + '-' + unspentOutput.tx_output_n;

      if (unspentOutput.confirmations > 0) {
        this.unspentOutputs[id] = {
          tx_hash: unspentOutput.tx_hash,
          tx_output_n: unspentOutput.tx_output_n,
          script: unspentOutput.script,
          value: unspentOutput.value,
          confirmations: unspentOutput.confirmations
        };
      }
    }
  };

  Wallet.prototype.fetchUnspentOutputs = function(address, hollaback) {
    var self = this;
    BlockChainInfo.unspent(address, function(data) {
      var result = [];
      if (data.unspent_outputs && data.unspent_outputs.length > 0) {
        result = data.unspent_outputs;
        self.unspentOutputs = {};
        self.updateUnspentOutputs(result);
      }

      hollaback(result);
    });
  };

  Wallet.prototype.balanceBTC = function() {
    var value = 0;
    this._eachUnspentOutput(function(unspentOutput) {
      value += unspentOutput.value;
    });

    return this._satoshisToBtc(value);
  };

  Wallet.prototype.selectCoins = function(opts) {
    var totalRequested = parseFloat(opts.amountBTC) + parseFloat(opts.minerFeeBTC),
        totalAvailable = this.balanceBTC(),
        selectedCoins = [],
        self = this;

    if (totalRequested <= totalAvailable) {
      // return the only output
      if (Object.keys(self.unspentOutputs).length === 1) {
        selectedCoins.push(self.unspentOutputs[Object.keys(self.unspentOutputs)[0]]);
      }
      if (selectedCoins.length > 0) { return selectedCoins; }

      // look for an output that has the exact amount
      self._eachUnspentOutput(function(unspentOutput) {
        if (totalRequested === self._satoshisToBtc(unspentOutput.value)) {
          selectedCoins.push(unspentOutput);
          return false;
        }
      });
      if (selectedCoins.length > 0) { return selectedCoins; }

      // collect outputs until requested amount is matched or exceeded
      var totalOutputValue = 0;
      self._eachUnspentOutput(function(unspentOutput) {
        selectedCoins.push(unspentOutput);
        totalOutputValue += self._satoshisToBtc(unspentOutput.value);

        if (totalRequested <= totalOutputValue) {
          return false;
        }
      });

    }

    return selectedCoins;
  };

  Wallet.prototype.buildTransaction = function(fromAddress, opts, hollaback) {
    var toAddress = opts.address,
        amount = opts.amount,
        transactionFee = opts.transactionFee,
        result = {},
        self = this;

    bitcoinWorker.async('validateAddress', [toAddress], function(isAddressValid) {
      result.isValid = false;

      if (!toAddress) {
        result.errorForAddress = "Address can't be blank";
      } else if (!isAddressValid) {
        result.errorForAddress = "Address is invalid";
      } else if (/\D$/.test(amount)) {
        result.errorForAmount = "Amount must be a number";
      } else if (parseFloat(amount) < 0.00000001) {
        result.errorForAmount = "Amount must be greater than 0.00000001 BTC";
      } else if (transactionFee && /\D$/.test(transactionFee)) {
        result.errorForTransactionFee = "Transaction Fee must be a number";
      } else if (transactionFee && parseFloat(transactionFee) < 0.00000001) {
        result.errorForTransactionFee = "Transaction Fee must be greater than 0.00000001 BTC";
      } else {
        result.isValid = true;

        result.inputs = self.selectCoins({
          amountBTC: amount,
          minerFeeBTC: transactionFee
        });

        result.outputs = [
          { address: toAddress, amount: amount }
        ];

        var totalInputs = 0;
        for (var i=0; i<result.inputs.length; i++) {
          var input = result.inputs[i];
          totalInputs += input.value;
        }

        var changeAmount = totalInputs - self._btcToSatoshis(amount) - self._btcToSatoshis(transactionFee);
        if (changeAmount > 0) {
          result.outputs.push({
            address: fromAddress,
            amount: self._satoshisToBtc(changeAmount)
          });
        }
      }

      hollaback(result);
    });
  };

  Wallet.prototype.sendTransaction = function(password, transaction, hollaback) {
    bitcoinWorker.async('buildAndSignRawTransaction', [entropy.randomWords(32), password, keyPair, transaction.inputs, transaction.outputs], function(signedRawTransaction) {
      if (signedRawTransaction) {
        console.log('raw', signedRawTransaction);
      } else {
        hollaback(false);
      }
    });
  };

  Models.Wallet = Wallet;
  Models.wallet = new Wallet();
})(BlockChainInfo, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.entropy, CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Models);
