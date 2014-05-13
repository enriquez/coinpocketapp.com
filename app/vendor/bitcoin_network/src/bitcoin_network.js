var BitcoinNetwork = (function(self, BlockChainInfo, HelloBlock) {

  var _handleCallback = function(hollaback, fallback, preprocess) {
    return function(data, success, statusCode) {
      if (success) {
        if (typeof preprocess === 'function') {
          preprocess(data);
        } else {
          hollaback(data);
        }
      } else {
        if (typeof fallback === 'function') {
          fallback();
        } else {
          hollaback(false);
        }
      }
    }
  };

  self.transactions = function(address, offset, hollaback) {
    var helloBlockFallback = function() {
      params = {};
      params.limit = 50;
      params.offset = offset || 0;
      params.transactions = true;
      HelloBlock.Wallet.get(address, params, _handleCallback(hollaback, null, function(data) {
        var transactions = [];
        for (var i=0; i<data.transactions.length; i++) {
          var txData = data.transactions[i];

          var inputs = [];
          for (var j=0; j<txData.inputs.length; j++) {
            var inputData = txData.inputs[j];
            inputs.push({
              prev_out: {
                addr: inputData.address,
                value: inputData.value,
                n: inputData.prevTxoutIndex
              },
              script: inputData.scriptSig
            });
          }

          var outputs = [];
          for (var k=0; k<txData.outputs.length; k++) {
            var outputData = txData.outputs[k];
            outputs.push({
              addr: outputData.address,
              n: outputData.index,
              value: outputData.value
            });
          }

          transactions.push({
            hash: txData.txHash,
            time: txData.estimatedTxTime,
            block_height: txData.blockHeight,
            out: outputs,
            inputs: inputs
          });
        }

        hollaback({ txs: transactions, wallet: { n_tx: data.summary.txsCount } });
      }));
    };

    BlockChainInfo.multiaddr(address, offset, _handleCallback(hollaback, helloBlockFallback));
  };

  self.unspentOutputs = function(address, hollaback) {
    var _reverseEndian = function(hex) {
      var reversed = '';
      for (var i=hex.length/2; i > 0; i--) {
        var currentByte = hex.substr((i * 2) - 2, 2);
        reversed += currentByte;
      }

      return reversed;
    }

    var helloBlockFallback = function() {
      HelloBlock.Addresses.unspents(address, { limit: 100 }, _handleCallback(hollaback, function() {
        hollaback({ error: true });
      }, function(data) {
        var unspent_outputs = [];

        for (var i=0; i<data.unspents.length; i++) {
          var unspentOutput = data.unspents[i];
          unspent_outputs.push({
            tx_hash: _reverseEndian(unspentOutput.txHash),
            tx_output_n: unspentOutput.index,
            script: unspentOutput.scriptPubKey,
            value: unspentOutput.value,
            confirmations: unspentOutput.confirmations
          });
        }

        hollaback({ unspent_outputs: unspent_outputs });
      }));
    };

    BlockChainInfo.unspent(address, _handleCallback(hollaback, helloBlockFallback));
  };

  self.pushTransaction = function(rawTxHex, hollaback) {
    var helloBlockFallback = function() {
      HelloBlock.Transactions.propogate(rawTxHex, _handleCallback(hollaback, null, function(data) {
        hollaback(data);
      }));
    };

    BlockChainInfo.pushtx(rawTxHex, _handleCallback(hollaback, helloBlockFallback));
  };

  self.currentBlockHeight = function(hollaback) {
    HelloBlock.Blocks.latest(function(data, success) {
      if (success) {
        hollaback(data.blocks[0].blockHeight);
      } else {
        hollaback(false);
      }
    });
  };

  return self;
})({}, BlockChainInfo, HelloBlock);
