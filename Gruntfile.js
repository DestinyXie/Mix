module.exports = function(grunt) {
  var paths = {
    requireLab: 'require',
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
        ignores: ['cordova-2.2.0.js', 'require.js']
      },
      uses_defaults: ['js/*.js']
    },
    qunit: {
      all: {
        options: {
          urls: [
            'http://localhost:8000/test/test1.html'
          ]
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
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
          fileExclusionRegExp: /^Gruntfile\.js|.gitignore|README|node_modules|package\.json|js|css|test$/
        }
      },
      compileCSS: {
        options: {
          cssIn: 'css/main.css',
          out: './dist/css/main.css',
          optimizeCss: 'standard'
        }
      },
      compileJS: {
        options: {
          baseUrl: 'js',
          out: './dist/js/main.built.js',
          name: 'main',
          paths: paths,
          map: pathMap,
          include: 'requireLab'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('t', ['connect', 'qunit']);
  grunt.registerTask('r', ['requirejs:compile']);
  grunt.registerTask('rc', ['requirejs:compileCSS']);
  grunt.registerTask('rj', ['requirejs:compileJS']);
  grunt.registerTask('ra', ['r', 'rc', 'rj']);
}