const fs = require('fs');
const jsonfile = require('jsonfile');

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
          "build/css/dialog.css": "less/dialog.less",
          "build/css/options.css": "less/options.less",
          "build/css/popup.css": "less/popup.less"
        }
      }
    },

    browserify: {
      dist: {
        files: {
          'build/js/char-codes.js': 'js/es5/content_script/char-codes.js',
          'build/js/content_script.js': 'js/es5/content_script/content.js',
          'build/js/popup.js': 'js/es5/popup/popup.coffee',
          'build/js/tran.js': 'js/es5/tran.js',
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

    // SOURCE CODE
    'babel': {
        options: {
          experimental: true,
          sourceMap: true
          //modules: "amd"
        },
        dist: {
            files: {
              'js/es5/polyfills/Array.from.js': 'js/es6/polyfills/Array.from.js',
              'js/es5/char-codes.js': 'js/es6/char-codes.js',
              'js/es5/char-codes-turk.js': 'js/es6/char-codes-turk.js',
              'js/es5/turkishdictionary.js': 'js/es6/turkishdictionary.js',
              'js/es5/options/options.js': 'js/es6/options/options.js',
              'js/es5/tran.js': 'js/es6/tran.js',
              'js/es5/utils.js': 'js/es6/utils.js',

              'js/es5/content_script/content.js': 'js/es6/content_script/content.js',
              'js/es5/content_script/tooltip.js': 'js/es6/content_script/tooltip.js',
              'js/es5/content_script/view.js': 'js/es6/content_script/view.js',
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

    makezip: {target: {}},
    upversion: {target: {}}
  });

  // Compress files and folders.
  grunt.loadNpmTasks('grunt-zip');
  // Copy files and folders.
  grunt.loadNpmTasks('grunt-contrib-copy');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // LESS compiler
  grunt.loadNpmTasks('grunt-contrib-less');
  // Coffee compiler
  grunt.loadNpmTasks('grunt-contrib-coffee');
  // browserify things
  grunt.loadNpmTasks('grunt-browserify');
  // ES6 -> ES5
  grunt.loadNpmTasks('grunt-babel');

  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  // Default task(s)
  grunt.registerTask('default', ['babel', 'browserify',/*'uglify',*/ 'less', 'copy', 'upversion', 'makezip']);

  grunt.registerMultiTask('makezip', 'Make zip file ready to upload to the CWS', function() {
    grunt.log.writeln('Building zip file ...');
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    let buildName = `tran-${manifest.version}.zip`;
    grunt.config.set('zip.tran.dest', `./zip/${buildName}`);
    grunt.task.run('zip');
  });

  grunt.registerMultiTask('upversion', 'Update versions', function () {
    const manifest = jsonfile.readFileSync('manifest.json', 'utf8');
    const packagejson = jsonfile.readFileSync('package.json', 'utf8');
    packagejson.version = manifest.version;
    console.log('version =', packagejson.version);
    jsonfile.writeFileSync('package.json', packagejson, {spaces: 2}, function (err) {
      console.error(err);
    })
  });
};