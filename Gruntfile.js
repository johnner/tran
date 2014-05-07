/*global module*/
module.exports = function(grunt) {

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

		coffee: {
			compile: {
				options: {
					sourceMap: false
				},
				files: {
					'build/js/background.js': 'js/background.coffee',
					//'build/js/content_script.js': 'js/content_script.coffee',
					'build/js/options.js': 'js/options.coffee',
					//'build/js/popup.js': 'js/popup.coffee',
					'build/js/tran.js': 'js/tran.coffee'
				}
			}
		},

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    browserify: {
      dist: {
        files: {
          'build/js/content_script.js': ['js/content_script/content.coffee'],
          'build/js/popup.js': ['js/popup/popup.coffee']
        },
        options: {
          transform: ['coffeeify'],
          debug: true,
          bundleOptions: {debug: true}
        }
      }
    }
  });
	//Compress files and folders.
	grunt.loadNpmTasks('grunt-zip');
	// Copy files and folders.
	grunt.loadNpmTasks('grunt-contrib-copy');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // LESS compiler
  grunt.loadNpmTasks('grunt-contrib-less');
	// Coffee compiler
	grunt.loadNpmTasks('grunt-contrib-coffee');
  // Test app with karma
  grunt.loadNpmTasks('grunt-karma');
  // browserify things
  grunt.loadNpmTasks('grunt-browserify');
  // Default task(s).
  grunt.registerTask('default', ['browserify', 'coffee', 'uglify','less','copy', 'zip']);
};