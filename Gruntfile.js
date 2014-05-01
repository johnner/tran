module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
			dynamic_mappings: {
				files: [
					{
						expand: true,     // Enable dynamic expansion.
						cwd: 'js/',      // Src matches are relative to this path.
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
					//{expand: true, src: ['styles/css/*'], dest: 'build/css/', filter: 'isFile'},
					{expand: true, src: ['background.html'], dest: 'build/', filter: 'isFile'},
					{expand: true, src: ['manifest.json'], dest: 'build/', filter: 'isFile'},
					{expand: true, src: ['options.html'], dest: 'build/', filter: 'isFile'},
					{expand: true, src: ['popup.html'], dest: 'build/', filter: 'isFile'}
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
				src: 'build/**/*',
				dest: 'tran.zip'
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

  // Default task(s).
  grunt.registerTask('default', ['uglify','less','copy', 'zip']);

};