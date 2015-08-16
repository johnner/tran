module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dynamic_mappings: {
        files: [
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'build/js',      // Src matches are relative to this path.
            src: ['*.js'], // Actual pattern(s) to match.
            dest: 'build/js/',   // Destination path prefix.
            ext: '.js',   // Dest filepaths will have this extension.
            extDot: 'first'   // Extensions in filenames begin after the first dot
          }
        ]
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['img/*'], dest: 'build/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['pages/*.html'], dest: 'build/', filter: 'isFile'},
          {expand: true, src: ['manifest.json'], dest: 'build/', filter: 'isFile'}
        ]
      }
    },

    less: {
      development: {
        options: {
          compress: true,
          cleancss: true
        },
        files: {
          "build/css/bootstrap.css": "less/bootstrap.less",
          "build/css/dialog.css": "less/dialog.less",
          "build/css/options.css": "less/options.less",
          "build/css/popup.css": "less/popup.less"
        }
      }
    },

    // make a zipfile
    zip: {
      tran: {
        cwd: 'build/',
        src: 'build/**/*',
        dest: 'tran.zip'
      }
    },

    browserify: {
      dist: {
        files: {
          'build/js/char-codes.js': 'js/es5/content_script/char-codes.js',
          'build/js/content_script.js': 'js/es5/content_script/content.coffee',
          'build/js/popup.js': 'js/es5/popup/popup.coffee',
          'build/js/tran.js': 'js/es5/tran.coffee',
          'build/js/turkishdictionary.js': 'js/es5/turkishdictionary.js',
          'build/js/background.js': 'js/es5/background.coffee',
          'build/js/options.js': 'js/es5/options/options.js',
          'build/js/utils.js': 'js/es5/utils.js'
        },
        options: {
          sourceMap: true,
          transform: ['coffeeify'],
          debug: true,
          bundleOptions: {debug: true}
        }
      }
    },

    '6to5': {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
              'js/es5/char-codes.js': 'js/es6/char-codes.js',
              'js/es5/char-codes-turk.js': 'js/es6/char-codes-turk.js',
              'js/es5/turkishdictionary.js': 'js/es6/turkishdictionary.js',
              'js/es5/options/options.js': 'js/es6/options/options.js',
              'js/es5/utils.js': 'js/es6/utils.js'
            }
        }
    }
  })
  // Compress files and folders.
  grunt.loadNpmTasks('grunt-zip')
  // Copy files and folders.
  grunt.loadNpmTasks('grunt-contrib-copy')
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify')
  // LESS compiler
  grunt.loadNpmTasks('grunt-contrib-less')
  // Coffee compiler
  grunt.loadNpmTasks('grunt-contrib-coffee')
  // browserify things
  grunt.loadNpmTasks('grunt-browserify')
  // ES6 -> ES5
  grunt.loadNpmTasks('grunt-6to5');

  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  // Default task(s)
  grunt.registerTask('default', [
    '6to5',
    'browserify',
    //'uglify',
    'less',
    'copy',
    //'karma',  // run jasmine tests in browser
    'zip'
  ]);
}