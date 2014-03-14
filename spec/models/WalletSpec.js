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
        value_hex: "085ae723",
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
        value_hex: "085ae723",
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
        value_hex: "085ae723",
        confirmations:1
      }])
      wallet.updateUnspentOutputs([{
        tx_hash: "04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da",
        tx_index: 115190321,
        tx_output_n: 1,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 240175139,
        value_hex: "085ae723",
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
        value_hex: "085ae723",
        confirmations:1
      }])
      wallet.updateUnspentOutputs([{
        tx_hash: "04d6db5a363a327e5aa86cf04a0e81285abe59f3bbd6596606dd16c67ff039da",
        tx_index: 115190320,
        tx_output_n: 0,
        script: "76a9147ae9da425681e3816686b5944d054f6a869da30988ac",
        value: 240175139,
        value_hex: "085ae723",
        confirmations:2
      }])

      expect(wallet.balanceBTC()).toEqual(2.40175139);
    });

  });

});
