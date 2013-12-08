module.exports = function(grunt) {
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
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/app.*.js', 'js/lib/mix.*.js', 'js/main.js', 'cordova-2.2.0.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {},
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
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
      }
    },
    jasmine: {
      xTask: {
        src: 'js/app.*.js',
        options: {
          host : 'http://127.0.0.1:8000/',
          specs: 'spec/*.spec.js',
          keepRunner: false,
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: 'js/main.js'
          }
        }
      },
      xlTask: {//local filesystem test
        src: 'js/app.*.js',
        options: {
          specs: 'spec/*.spec.js',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: 'js/main.js'
          }
        }
      }
    },
    watch: {
      files: ['<%= jshint.files%>'],
      tasks: ['jshint']
    },
    requirejs: {
      compile: { //just copy files exclude css & js
        options: {
          appDir: './',
          dir: './dist',
          fileExclusionRegExp: /^.gitignore|README|node_modules|package.json|js|css|spec|index.htm$/
        }
      },
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
          'dist/css/app.css': 'css/app.less',
          'css/app.css': 'css/app.less'
        }
      },
      compress: {
        options: {
          compress: true,
          sourceMap: true,
          sourceMapFilename: 'dist/css/main.css.map',
          sourceMapBasepath: 'dist/css'
        },
        src: 'dist/css/app.css',
        dest: 'dist/css/main.css',
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('c', ['connect']);
  //test tasks
  grunt.registerTask('test', ['c', 'uglify']);
  grunt.registerTask('h', ['jshint']);
  grunt.registerTask('jlt', ['jasmine:xlTask']);
  //useful tasks
  grunt.registerTask('r', ['requirejs:compile']);
  grunt.registerTask('l', ['less:compile', 'less:compress']);
  grunt.registerTask('rj', ['requirejs:compileJS']);
  grunt.registerTask('default', ['r', 'l', 'rj']);
  grunt.registerTask('jt', ['c', 'jasmine:xTask']);
}