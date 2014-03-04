describe("PageHash", function() {

  var PageHash;

  beforeEach(function() {
    PageHash = CoinPocketApp.Models.PageHash;
  });

  describe("#pageParamsForHash", function() {

    it("returns #/", function() {
      var actual = PageHash.pageParamsForHash("#/");
      expect(actual).toEqual({
        page: "#/", params: {}
      });
    });

    it("returns #/send", function() {
      var actual = PageHash.pageParamsForHash("#/send");
      expect(actual).toEqual({
        page: "#/send", params: {}
      });
    });

    it("returns #/receive", function() {
      var actual = PageHash.pageParamsForHash("#/receive");
      expect(actual).toEqual({
        page: "#/receive", params: {}
      });
    });

    it("returns #/ given null or undefined", function() {
      var actual;
      var expected = {
        page: "#/", params: {}
      };

      actual = PageHash.pageParamsForHash(null);
      expect(actual).toEqual(expected);
      actual = PageHash.pageParamsForHash(undefined);
      expect(actual).toEqual(expected);
    });

    it("returns #/ given anything unexpected", function() {
      var actual = PageHash.pageParamsForHash("#/foo");
      expect(actual).toEqual({
        page: "#/", params: {}
      });
    });

    it("returns #/send with params", function() {
      var actual = PageHash.pageParamsForHash("#/send?code=1KCVyR5Ucq3ExNhVFwbTWkeviU1ZpWpSoH");
      expect(actual).toEqual({
        page: "#/send",
        params: { code: "1KCVyR5Ucq3ExNhVFwbTWkeviU1ZpWpSoH" }
      });
    });

    it("returns #/ to an unknown page with params", function() {
      var actual = PageHash.pageParamsForHash("#/what?code=1KCVyR5Ucq3ExNhVFwbTWkeviU1ZpWpSoH");
      expect(actual).toEqual({
        page: "#/", params: {}
      });
    });

    it("returns #/send to a known page when hash contains more than one ?", function() {
      var actual = PageHash.pageParamsForHash("#/send?code=1KCVyR5Uc?q3ExNhVFwbTWkeviU1ZpWpSoH");
      expect(actual).toEqual({
        page: "#/send", params: {}
      });
    });

    it("returns #/send given #/send?", function() {
      var actual = PageHash.pageParamsForHash("#/send?");
      expect(actual).toEqual({
        page: "#/send", params: {}
      });
    });

    it("returns #/send with empty string param given #/send?foonovalue", function() {
      var actual = PageHash.pageParamsForHash("#/send?foonovalue");
      expect(actual).toEqual({
        page: "#/send",
        params: { "foonovalue" : '' }
      });
    });

    it("returns #/send with undefined value given #/send?foonovalue=", function() {
      var actual = PageHash.pageParamsForHash("#/send?foonovalue=");
      expect(actual).toEqual({
        page: "#/send",
        params: { "foonovalue" : '' }
      });
    });

    it("returns #/send with undefined value given #/send?foonovalue=&foo=bar", function() {
      var actual = PageHash.pageParamsForHash("#/send?foonovalue=&foo=bar");
      expect(actual).toEqual({
        page: "#/send",
        params: { "foonovalue" : '', "foo" : "bar" }
      });
    });

    it("returns #/send while url decoding params", function() {
      var actual = PageHash.pageParamsForHash("#/send?Hello%20There%3D=JavaScript_%D1%88%D0%B5%D0%BB%D0%BB%D1%8B");
      expect(actual).toEqual({
        page: "#/send",
        params: { "Hello There=" : "JavaScript_шеллы" }
      });
    });

  });

});
