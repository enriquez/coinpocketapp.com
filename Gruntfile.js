module.exports = function(grunt) {

  var Files = {
    vendor: function() {
      return [
        'app/vendor/js/jquery-1.11.0.js',
        'app/vendor/bootstrap-3.1.1-dist/js/bootstrap.min.js',
        'app/vendor/js/microevent.js',
        'app/vendor/sjcl/sjcl.js',
        'app/vendor/sjcl/core/bn.js',
        'app/vendor/sjcl/core/ecc.js'
      ]
    },
    source: function() {
      return [
        'app/js/sjcl_ext/codecBase58.js',
        'app/js/sjcl_ext/ripemd160.js',
        'app/js/bitcoin.js',
        'app/js/coinpocketapp.js',
        'app/js/entropy.js',
        'app/js/welcome_modal_view.js',
        'app/js/welcome_modal_controller.js'
      ];
    },
    all: function () { this.vendor().join(this.source()); }
  };

  grunt.initConfig({
    jasmine: {
      spec: {
        src: Files.source(),
        options: {
          specs: 'spec/**/*Spec.js',
          vendor: Files.vendor()
        }
      }
    },
    connect: {
      dev: {
        options: {
          base: 'app',
          keepalive: true,
          debug: true
        }
      }
    },
    jshint: {
      all: Files.source()
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'jasmine']);

};
