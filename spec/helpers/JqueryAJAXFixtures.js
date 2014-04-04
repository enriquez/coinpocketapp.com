$.ajax = function(opts) {
  var endPoint = opts.url;
  var hollaback = opts.success;

  if (endPoint === "https://blockchain.info/multiaddr?active=1M3p9Gfhn9vrPgjYLZEcFSnxSM6WuCVm2Y-empty&no_compact=true&offset=0") {
    // Empty transactions
    var json = {
      "address": "1M3p9Gfhn9vrPgjYLZEcFSnxSM6WuCVm2Y",
      "final_balance": 0,
      "hash160": "dbeab3439788b867c4f212e73f42a6648db1a1b7",
      "n_tx": 0,
      "total_received": 0,
      "total_sent": 0
    };
    var txs = [];

    hollaback({ 'txs': txs, 'wallet': json });
  } else if (endPoint === "https://blockchain.info/multiaddr?active=1KCVyR5Ucq3ExNhVFwbTWkeviU1ZpWpSoH-2credit1debit&no_compact=true&offset=0") {
    // 2 credits and 1 debit
    var json = {
      "address": "1KCVyR5Ucq3ExNhVFwbTWkeviU1ZpWpSoH-2credit1debit",
      "final_balance": 1000000000,
      "hash160": "c79f065d1f516c93776114325be061c5bfd63793",
      "n_tx": 3,
      "total_received": 1001000000,
      "total_sent": 1000000
    };

    var txs = [
        {
        "block_height": 279165,
        "hash": "f981384f0d4da2b90774226e4e89fd39d0e092922c0f69630cd9e1f9762970da",
        "inputs": [
          {
          "prev_out": {
            "addr": "18J6nWWgRHKY6owWgJ3cXrixfi5TsdwVi",
            "n": 2,
            "tx_index": 106531578,
            "type": 0,
            "value": 3359622
          }
        },
        {
          "prev_out": {
            "addr": "1CHhMZMFmJK18RdBGLGyyhtxcM6a3jcJEz",
            "n": 0,
            "tx_index": 106539715,
            "type": 0,
            "value": 1000000000
          }
        }
        ],
        "out": [
          {
          "addr": "1KCVyR5Ucq3ExNhVFwbTWkeviU1ZpWpSoH-2credit1debit",
          "n": 0,
          "tx_index": 106538049,
          "type": 0,
          "value": 1000000000
        },
        {
          "addr": "1MRCFzZqSWp3JckWkBFRZfq5hwf7qM8E2B",
          "n": 1,
          "tx_index": 106538049,
          "type": 0,
          "value": 3339622
        }
        ],
        "relayed_by": "127.0.0.1",
        "result": 0,
        "size": 438,
        "time": 1389124087,
        "tx_index": 106538049,
        "ver": 1,
        "vin_sz": 2,
        "vout_sz": 2
      },
      {
        "block_height": 279054,
        "hash": "873b2a002b466b20c05ded50b0f0d7e378a24709acf31b9de35a90d1d5433d65",
        "inputs": [
          {
          "prev_out": {
            "addr": "1KCVyR5Ucq3ExNhVFwbTWkeviU1ZpWpSoH-2credit1debit",
            "n": 0,
            "tx_index": 105431468,
            "type": 0,
            "value": 1000000
          }
        }
        ],
        "out": [
          {
          "addr": "13YiSyhdhHoxL1LZuufh4JFSLQix1N72LA",
          "n": 0,
          "tx_index": 106416936,
          "type": 0,
          "value": 990000
        }
        ],
        "relayed_by": "127.0.0.1",
        "result": 1000000000,
        "size": 224,
        "time": 1389067925,
        "tx_index": 106416936,
        "ver": 1,
        "vin_sz": 1,
        "vout_sz": 1
      },
      {
        "block_height": 278021,
        "hash": "c715981656ddfd6750a984f94573467f4908b772d649a24abe193b3b73ea9e2b",
        "inputs": [
          {
          "prev_out": {
            "addr": "17acNyKGtieoi1QKo6vvPVtGVAsACJycsc",
            "n": 0,
            "tx_index": 105262311,
            "type": 0,
            "value": 3980000
          }
        }
        ],
        "out": [
          {
          "addr": "1KCVyR5Ucq3ExNhVFwbTWkeviU1ZpWpSoH-2credit1debit",
          "n": 0,
          "tx_index": 105431468,
          "type": 0,
          "value": 1000000
        },
        {
          "addr": "16h3XtawehExMx8DadgCEYTPQXdceUK6uT",
          "n": 1,
          "tx_index": 105431468,
          "type": 0,
          "value": 2970000
        }
        ],
        "relayed_by": "46.246.58.138",
        "result": -1000000,
        "size": 226,
        "time": 1388545895,
        "tx_index": 105431468,
        "ver": 1,
        "vin_sz": 1,
        "vout_sz": 2
      }
    ];

    hollaback({ 'txs': txs, 'wallet': json });
  } else {
    console.log("Need to stub AJAX request in spec/helpers/JqueryAJAXFixtures.js for url: " + endPoint);
    throw "$.getJSON needs stub";
  }

}
