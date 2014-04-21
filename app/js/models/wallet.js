(function(BitcoinNetwork, keyPair, entropy, bitcoinWorker, Models) {

  function Wallet() {
    this.unspentOutputs = {};

    this._btcToSatoshis = function(btc) {
      return parseInt((btc * 100000000).toFixed(0), 10);
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
    BitcoinNetwork.unspentOutputs(address, function(data) {
      var result = [];
      if (data.unspent_outputs) {
        result = data.unspent_outputs;
        self.unspentOutputs = {};
        self.updateUnspentOutputs(result);
      }

      if (typeof hollaback === 'function') {
        hollaback(result);
      }
      self.trigger('unspentOutputs.updated', self.unspentOutputs);
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
    var totalRequested = parseFloat((parseFloat(opts.amountBTC) + parseFloat(opts.minerFeeBTC)).toFixed(8)),
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

      // look for an output that is greater than requested amount
      self._eachUnspentOutput(function(unspentOutput) {
        if (totalRequested < self._satoshisToBtc(unspentOutput.value)) {
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

  Wallet.prototype._buildInputsAndOuptuts = function(obj, toAddress, fromAddress, amount, transactionFee) {
    obj.inputs = [];
    obj.outputs = [];

    obj.inputs = this.selectCoins({
      amountBTC: amount,
      minerFeeBTC: transactionFee
    });

    obj.outputs = [
      { address: toAddress, amount: parseFloat(amount) }
    ];

    var totalInputs = 0.0;
    for (var i=0; i<obj.inputs.length; i++) {
      var input = obj.inputs[i];
      totalInputs += parseFloat(input.value);
    }

    var changeAmount = this._satoshisToBtc(totalInputs - this._btcToSatoshis(amount) - this._btcToSatoshis(transactionFee));
    if (changeAmount > 0) {
      obj.outputs.push({
        address: fromAddress,
        amount: changeAmount
      });
    }
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
      } else if (!amount) {
        result.errorForAmount = "Amount is not valid";
      } else if (/\D$/.test(amount)) {
        result.errorForAmount = "Amount must be a number";
      } else if (parseFloat(amount) < 0.00000001) {
        result.errorForAmount = "Amount must be greater than 0.00000001 BTC";
      } else if (transactionFee && /\D$/.test(transactionFee)) {
        result.errorForTransactionFee = "Transaction Fee must be a number";
      } else if (transactionFee && parseFloat(transactionFee) < 0.00000001) {
        result.errorForTransactionFee = "Transaction Fee must be greater than 0.00000001 BTC";
      } else if (parseFloat(amount) > self.balanceBTC()) {
        result.errorMessage = 'Insufficient funds';
      } else if (transactionFee && parseFloat(amount) + parseFloat(transactionFee) > self.balanceBTC()) {
        result.errorMessage = 'Insufficient funds';
      } else {
        result.isValid = true;

        if (transactionFee) {
          self._buildInputsAndOuptuts(result, toAddress, fromAddress, amount, transactionFee);
        } else {
          // default to 0.0001 miner fee
          // this wallet is for small everyday spending amounts...
          // it is unlikely the priority will be high enough to be free
          var calculatedFee = 0.0001;
          self._buildInputsAndOuptuts(result, toAddress, fromAddress, amount, calculatedFee);

          var sizeEstimate = 148 * result.inputs.length + 34 * result.outputs.length + 10;

          if (sizeEstimate > 1000) {
            calculatedFee = Math.ceil(sizeEstimate / 1000) * 0.0001;
            buildInputsAndOuptuts(amount, calculatedFee);
          }

          if (result.inputs.length === 0) {
            result.isValid = false;
            result.errorMessage = 'Unable to create transaction with sufficient fees. Try lowering the amount by ' + calculatedFee + ' BTC';
          }
        }
      }

      hollaback(result);
    });
  };

  Wallet.prototype.sendTransaction = function(password, transaction, hollaback) {
    bitcoinWorker.async('buildAndSignRawTransaction', [entropy.randomWords(32), password, keyPair, transaction.inputs, transaction.outputs], function(result) {
      if (result.error) {
        hollaback(false, result.error);
      } else {
        var signedRawTransaction = result;
        console.log(signedRawTransaction);
        BitcoinNetwork.pushTransaction(signedRawTransaction, function(success) {
          hollaback(success);
        });
      }
    });
  };

  MicroEvent.mixin(Wallet);
  Models.Wallet = Wallet;
  Models.wallet = new Wallet();
})(BitcoinNetwork, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.entropy, CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Models);
