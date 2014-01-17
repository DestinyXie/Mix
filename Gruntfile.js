'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var paths = {
    requireLab: 'require',
    base: 'lib/mix.base',
    dom: 'lib/mix.dom',
    scroll: 'lib/mix.scroll',
    swipeview: 'lib/mix.swipeview',
    device: 'lib/mix.bridge.cordova',
    X: 'lib/mix.x',
    region: 'lib/mix.regions',
    ui: 'lib/mix.ui',
    action: 'app.action',
    tool: 'app.tool',
    stor: 'app.stor',
    view: 'app.view',
    home: 'app.home',
    page: 'app.page',
    feed: 'app.feed'
  };
  var pathMap = {
    '*': {
      'cordova': 'cordova-2.2.0'
    }
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          console: true,
          module: true
        },
        ignores: ['cordova-2.2.0.js', 'require.js']
      },
      uses_defaults: ['js/*.js']
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      },
      dist: {
        options: {
          open: "http://127.0.0.1:8001/app.htm",
          port: 8001,
          base: './dist'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files%>'],
      tasks: ['jshint']
    },
    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'dist/*'
          ]
        }]
      }
    },
    copy: {
      dist: {
        files: [{
        expand: true,
        dot: true,
        cwd: '.',
        dest: './dist',
        src: [
          'image/',
          'app.htm',
          'css/',
          'js/'
        ]
        }]
      }
    },
    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'image',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: 'dist/image'
        }]
      }
    },
    requirejs: {
      compileJS: {
        options: {
          baseUrl: 'js',
          out: './dist/js/main.built.js',
          name: 'main',
          paths: paths,
          map: pathMap,
          optimize: "uglify2",
          generateSourceMaps: true,
          preserveLicenseComments: false,
          uglify: {
            beautify: false,
            ascii_only: true
          },
          include: 'requireLab'
        }
      }
    },
    less: {
      compile: {
        files: {
          'css/app.css': 'css/app.less'
        }
      },
      compress: {
        options: {
          compress: true,
          sourceMap: true,
          sourceMapFilename: 'dist/css/main.css.map',
          sourceMapBasepath: 'dist/css',
          outputSourceFiles: true
        },
        src: 'css/app.css',
        dest: 'dist/css/main.css',
      }
    },
    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            'dist/js/{,*/}*.js',
            'dist/css/{,*/}*.css',
            'dist/image/{,*/}*.{gif,jpeg,jpg,png,webp}',
            'dist/css/fonts/{,*/}*.*'
          ]
        }
      }
    },
    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: 'dist'
      },
      html: 'app.htm'
    },
    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        basedir: ['dist']
      },
      html: ['dist/{,*/}*.htm'],
      css: ['dist/css/{,*/}*.css']
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.registerTask('c', ['connect']);
  grunt.registerTask('cc', ['connect:dist:keepalive']);
  grunt.registerTask('cl', ['clean']);
  grunt.registerTask('cp', ['copy:dist']);
  //test tasks
  grunt.registerTask('h', ['jshint']);
  grunt.registerTask('jlt', ['jasmine:xlTask']);
  //useful tasks
  grunt.registerTask('l', ['less:compile', 'less:compress']);
  grunt.registerTask('r', ['requirejs:compileJS']);
  grunt.registerTask('default', ['cl', 'useminPrepare', 'cp', 'imagemin', 'l', 'r', 'rev', 'usemin']);
  grunt.registerTask('jt', ['c', 'jasmine:xTask']);
  grunt.registerTask('k', ['karma']);
}
