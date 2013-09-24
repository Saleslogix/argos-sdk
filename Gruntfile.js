module.exports = function(grunt) { 
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['src/**/*.js']
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: '127.0.0.1',
                    base: '.'
                }
            }
        },
        jasmine: {
            src: ['src/**/*.js'],
            options: {
                specs: 'tests/**/*.js',
                host: 'http://127.0.0.1:8000/',
                template: 'GruntRunner.tmpl'
            }
        },
        less: {
            development: {
                options: {
                },
                files: {
                    'min/css/themes/sage-green/sdk.min.sage-green.debug.css': 'content/css/themes/sage-green.less',
                    'min/css/themes/swiftpage/sdk.min.swiftpage.debug.css': 'content/css/themes/swiftpage.less'
                }
            },
            production: {
                options: {
                    yuicompress: true
                },
                files: {
                    'min/css/themes/sage-green/sdk.min.sage-green.css': 'content/css/themes/sage-green.less',
                    'min/css/themes/swiftpage/sdk.min.swiftpage.css': 'content/css/themes/swiftpage.less'
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            },
            less: {
                files: ['content/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['connect', 'jasmine']);
    grunt.registerTask('default', ['test']);
};
