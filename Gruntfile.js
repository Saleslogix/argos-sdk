module.exports = function(grunt) { 
    grunt.initConfig({
        jshint: {
            options: {
                "sub": true
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
                    paths: ['content/css']
                },
                files: {
                    'min/css/sdk.min.sage-green.debug.css': 'content/css/themes/sage-green.less',
                    'min/css/sdk.min.swiftpage.debug.css': 'content/css/themes/swiftpage.less'
                }
            },
            production: {
                options: {
                    paths: ['content/css'],
                    yuicompress: true
                },
                files: {
                    'min/css/sdk.min.sage-green.css': 'content/css/themes/sage-green.less',
                    'min/css/sdk.min.swiftpage.css': 'content/css/themes/swiftpage.less'
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'min/css/sdk.min.css': ['content/reui/themes/sage-green/theme.css', 'content/css/base.css']
                }
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc',
                formatters: [
                    { id: 'junit-xml', dest: 'report/junit.xml' }
                ]
            },
            lax: {
                src: ['content/**/*.css']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('test', ['connect', 'jasmine']);
    grunt.registerTask('default', ['test']);
};
