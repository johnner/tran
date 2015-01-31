module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dynamic_mappings: {
        files: [
          {
            expand: true,     # Enable dynamic expansion.
            cwd: 'build/js',      # Src matches are relative to this path.
            src: ['*.js'], # Actual pattern(s) to match.
            dest: 'build/js/',   # Destination path prefix.
            ext: '.js',   # Dest filepaths will have this extension.
            extDot: 'first'   # Extensions in filenames begin after the first dot
          }
        ]
      }
    },
    copy: {
      main: {
        files: [
          # includes files within path
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

    # make a zipfile
    zip: {
      tran: {
        cwd: 'build/',
        src: 'build/**/*',
        dest: 'tran.zip'
      }
    },

    coffee: {
      compile: {
        options: {
          sourceMap: true
          debug: true
        },
        files: {
          #'build/js/background.js': 'js/background.coffee',
          #'build/js/options.js': 'js/options.coffee'
          #'build/js/tran.js': 'js/tran.coffee',
          #'build/js/char-codes.js': 'js/char-codes.js'
        }
      }
    },

    browserify: {
      dist: {
        files: {
          'build/js/char-codes.js': 'js/content_script/char-codes.js',
          'build/js/content_script.js': ['js/content_script/content.coffee'],
          'build/js/popup.js': ['js/popup/popup.coffee']
          'build/js/tran.js': ['js/tran.coffee']
          'build/js/turkishdictionary.js': ['js/turkishdictionary.coffee'],
          'build/js/background.js': 'js/background.coffee'
        },
        options: {
          transform: ['coffeeify'],
          debug: true,
          bundleOptions: {debug: true}
        }
      }
    },

    traceur: {
      options: {
        # traceur options here
        experimental: true,
        blockBinding: true,
        # module naming options,
#        moduleNaming: {
#          stripPrefix: "src/es6",
#          addPrefix: "com/mycompany/project"
#        },
        copyRuntime: 'js/es5'
      },
      custom: {
        files: [{
          expand: true,
          cwd: 'js/es6',
          src: ['*.js'],
          dest: 'js/'
        }]
      }
    },

    '6to5': {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'js/turkishdictionary.js': 'js/es6/turkishdictionary.js'
            }
        }
    }
  })
  # Compress files and folders.
  grunt.loadNpmTasks('grunt-zip')
  # Copy files and folders.
  grunt.loadNpmTasks('grunt-contrib-copy')
  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify')
  # LESS compiler
  grunt.loadNpmTasks('grunt-contrib-less')
  # Coffee compiler
  grunt.loadNpmTasks('grunt-contrib-coffee')
  # browserify things
  grunt.loadNpmTasks('grunt-browserify')
  # ES6 -> ES5
  #grunt.loadNpmTasks('grunt-traceur')
  grunt.loadNpmTasks('grunt-6to5');
  grunt.registerTask('es', ['traceur']);

  require('load-grunt-tasks')(grunt); # npm install --save-dev load-grunt-tasks

  # Default task(s)
  grunt.registerTask('default', [
    #'traceur',
    '6to5',
    'browserify',
    'coffee',
    'uglify',
    'less',
    'copy',
    #'karma',  # run jasmine tests in browser
    'zip'
  ]);
