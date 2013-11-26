module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/app.*.js', 'js/mix.*.js', 'js/main.js', 'cordova-2.2.0.js'],
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
        ignores: ['js/r.js', 'build.js', 'main.build.js', 'cordova-2.2.0.js', 'require.js']
      },
      uses_defaults: ['js/*.js']
    },
    qunit: {
      files: ['*.htm']
    },
    watch: {
      files: ['<%= jshint.files%>'],
      tasks: ['jshint']
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "js",
          appDir: "./",
          dir: "./dist",
          modules: [{
              name: "main"
          }],
          paths: {
              base: 'mix.base',
              scroll: 'mix.scroll',
              swipeview: 'mix.swipeview',
              cordovaBridge: 'mix.bridge.cordova',
              X: 'mix.x',
              region: 'mix.regions',
              ui: 'mix.ui',
              action: 'app.action',
              tool: 'app.tool',
              stor: 'app.stor',
              view: 'app.view',
              home: 'app.home',
              page: 'app.page',
              feed: 'app.feed'
          },
          map: {
              '*': {
                  'cordova': 'cordova-2.2.0'
              }
          },
          fileExclusionRegExp: /^(r|build|main\.build|Gruntfile)\.js|build\.sh|.gitignore|README|node_modules$/,
          optimizeCss: "standard"
        }
      },
      compile1: {
        options: {
          baseUrl: "js",
          out: "./dist/js/main.built.js",
          name: "main",
          paths: {
              requireLib: 'require',
              base: 'mix.base',
              scroll: 'mix.scroll',
              swipeview: 'mix.swipeview',
              cordovaBridge: 'mix.bridge.cordova',
              X: 'mix.x',
              region: 'mix.regions',
              ui: 'mix.ui',
              action: 'app.action',
              tool: 'app.tool',
              stor: 'app.stor',
              view: 'app.view',
              home: 'app.home',
              page: 'app.page',
              feed: 'app.feed'
          },
          map: {
              '*': {
                  'cordova': 'cordova-2.2.0'
              }
          },
          include: "requireLib"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('r', ['requirejs:compile']);
  grunt.registerTask('r1', ['requirejs:compile1']);
  grunt.registerTask('ra', ['requirejs:compile', 'requirejs:compile1']);
}