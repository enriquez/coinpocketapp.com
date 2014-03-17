describe("Wallet", function() {

  var wallet;
  beforeEach(function() {
    wallet = new CoinPocketApp.Models.Wallet();
  });

  describe("#balanceBTC", function() {

    it("returns 0 with no unspent outputs", function() {
      expect(wallet.balanceBTC()).toEqual(0);
    });

    it("returns 0 with an unconfirmed output", function() {
      wallet.updateUnspentOutputs([{
        tx_hash: "04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 140175139,
        confirmations:0
      }])

      expect(wallet.balanceBTC()).toEqual(0);
    });

    it("returns the value in BTC with one confirmation", function() {
      wallet.updateUnspentOutputs([{
        tx_hash: "04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 140175139,
        confirmations:1
      }])

      expect(wallet.balanceBTC()).toEqual(1.40175139);
    });

    it("returns the combined value of all unspent outputs", function() {
      wallet.updateUnspentOutputs([{
        tx_hash: "04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 140175139,
        confirmations:1
      }])
      wallet.updateUnspentOutputs([{
        tx_hash: "04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da",
        tx_index: 115190321,
        tx_output_n: 1,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 240175139,
        confirmations:3
      }])

      expect(wallet.balanceBTC()).toEqual(3.80350278);
    });

    it("identifies the unspent output by its hash and output_n pair. latest value is used in calculation of balance", function() {
      wallet.updateUnspentOutputs([{
        tx_hash: "04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 140175139,
        confirmations:1
      }])
      wallet.updateUnspentOutputs([{
        tx_hash: "04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 240175139,
        confirmations:2
      }])

      expect(wallet.balanceBTC()).toEqual(2.40175139);
    });

  });

  describe("#selectCoins", function() {

    it("returns nothing if the requested amount is higher than the total value", function() {
      wallet.updateUnspentOutputs([{
        tx_hash: "04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 140175139,
        confirmations:1
      }])

      expect(wallet.selectCoins({
        amountBTC: 1.40175139,
        minerFee: 0.0001
      })).toEqual([]);
    });

    it("returns the only unspent output", function() {
      var unspentOutput = {
        tx_hash: "04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 140175139,
        confirmations:1
      };
      wallet.updateUnspentOutputs([unspentOutput]);

      expect(wallet.selectCoins({
        amountBTC: 1.40165139,
        minerFeeBTC: 0.0001
      })[0].tx_hash).toEqual('04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da');
      expect(wallet.selectCoins({
        amountBTC: 1.0,
        minerFeeBTC: 0.0001
      })[0].tx_hash).toEqual('04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da');
    });

    it("prefers exact amounts over age", function() {
      var expected = {
        tx_hash: "pickme",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 150000000,
        confirmations:10
      };
      var older = {
        tx_hash: "older",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 100000000,
        confirmations:11
      };
      var newer = {
        tx_hash: "newer",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 200000000,
        confirmations:9
      };
      wallet.updateUnspentOutputs([newer, expected, older]);

      expect(wallet.selectCoins({
        amountBTC: 1.4999,
        minerFeeBTC: 0.0001
      })[0].tx_hash).toEqual('pickme');
    });

    it("collects outputs starting from oldest to newest until the requested amount is matched or exceeded", function() {
      var first = {
        tx_hash: "first",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 100000000,
        confirmations:10
      };
      var second = {
        tx_hash: "second",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 50000000,
        confirmations:9
      };
      var third = {
        tx_hash: "third",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 150010000,
        confirmations:8
      };

      wallet.updateUnspentOutputs([first, second, third]);

      var selectsFirst = wallet.selectCoins({
        amountBTC: 0.2,
        minerFeeBTC: 0.0001
      });
      expect(selectsFirst.length).toEqual(1);
      expect(selectsFirst[0].tx_hash).toEqual('first');

      var selectsFirstTwo = wallet.selectCoins({
        amountBTC: 1.2,
        minerFeeBTC: 0.0001
      });
      expect(selectsFirstTwo.length).toEqual(2);
      expect(selectsFirstTwo[0].tx_hash).toEqual('first');
      expect(selectsFirstTwo[1].tx_hash).toEqual('second');

      var selectsAll = wallet.selectCoins({
        amountBTC: 1.6,
        minerFeeBTC: 0.0001
      });
      expect(selectsAll.length).toEqual(3);
      expect(selectsAll[0].tx_hash).toEqual('first');
      expect(selectsAll[1].tx_hash).toEqual('second');
      expect(selectsAll[2].tx_hash).toEqual('third');
    });

  });

});
