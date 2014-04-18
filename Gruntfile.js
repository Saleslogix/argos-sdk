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
                    port: 8001,
                    hostname: '127.0.0.1',
                    base: '.'
                }
            }
        },
        jasmine: {
            coverage: {
                src: ['src/**/*.js'],
                options: {
                    specs: 'tests/**/*.js',
                    host: 'http://127.0.0.1:8001/',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/coverage.json',
                        report: [
                            {
                                type: 'text'
                            },
                            {
                                type: 'html',
                                options: {
                                    dir: 'coverage'
                                }
                            }
                        ],
                        template: 'GruntRunner.tmpl'
                    }
                }
            }
        },
        less: {
            development: {
                options: {
                },
                files: {
                    'min/css/themes/swiftpage/sdk.min.swiftpage.debug.css': 'content/css/themes/swiftpage.less'
                }
            },
            production: {
                options: {
                    cleancss: true
                },
                files: {
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

    grunt.registerTask('test', ['connect', 'jasmine:coverage']);
    grunt.registerTask('default', ['test']);
};
