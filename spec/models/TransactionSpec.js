describe("Transaction", function() {

  describe("transaction.confirmations", function() {

    describe("without a block height", function() {
      var transaction;

      beforeEach(function() {
        transaction = new CoinPocketApp.Models.Transaction({
          time: 1389124087,
          deltaAmount: 1000000000
        });
      });

      it("returns 0 confirmations at any block height", function() {
        expect(transaction.confirmations(280000)).toEqual(0);
        expect(transaction.confirmations(100)).toEqual(0);
        expect(transaction.confirmations(99999999)).toEqual(0);
      });

    });

    describe("at a block height of 280000", function() {
      var transaction;

      beforeEach(function() {
        transaction = new CoinPocketApp.Models.Transaction({
          time: 1389124087,
          deltaAmount: 1000000000,
          blockHeight: 280000
        });
      });

      it("returns 0 at 279998 blocks", function() {
        expect(transaction.confirmations(279998)).toEqual(0);
      });

      it("returns 0 at 279999 blocks", function() {
        expect(transaction.confirmations(279999)).toEqual(0);
      });

      it("returns 1 at 280000 blocks", function() {
        expect(transaction.confirmations(280000)).toEqual(1);
      });

      it("returns 2 at 280001 blocks", function() {
        expect(transaction.confirmations(280001)).toEqual(2);
      });
    });

  });

  describe("transactions#fetchRecent", function() {
    var transactions = CoinPocketApp.Models.transactions;

    describe("with no transactions", function() {
      var result;

      beforeEach(function(done) {
        result = null;
        transactions.fetchRecent('1M3p9Gfhn9vrPgjYLZEcFSnxSM6WuCVm2Y-empty', function(txs) {
          result = txs;
          done()
        });
      });

      it("is empty", function() {
        expect(result).toEqual([]);
      });

    });

    describe("with 2 credits and 1 debit", function() {
      var result;

      beforeEach(function(done) {
        result = null;
        transactions.fetchRecent('1KCVyR5Ucq3ExNhVFwbTWkeviU1ZpWpSoH-2credit1debit', function(txs) {
          result = txs;
          done()
        });
      });

      it("has 3 transactions", function() {
        expect(result.length).toEqual(3);
      });

      it("is ordered by most recent first", function() {
        expect(result[0].time).toEqual(1389124087);
        expect(result[1].time).toEqual(1389067925);
        expect(result[2].time).toEqual(1388545895);
      });

      it("reports each transactions amount delta", function() {
        expect(result[0].amountDelta).toEqual(1000000000);
        expect(result[1].amountDelta).toEqual(-1000000);
        expect(result[2].amountDelta).toEqual(1000000);
      });

      it("reports each transactions block height", function() {
        expect(result[0].blockHeight).toEqual(279165);
        expect(result[1].blockHeight).toEqual(279054);
        expect(result[2].blockHeight).toEqual(278021);
      });

    });

  });

});
