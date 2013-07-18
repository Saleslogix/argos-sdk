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
        cssmin: {
            combine: {
                files: {
                    'min/css/sdk.min.css': ['content/reui/themes/sage-green/theme.css', 'content/css/base.css'],
                    'min/css/test.min.css': ['content/reui/themes/sage-green/test.css']
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

    grunt.registerTask('test', ['connect', 'jasmine']);
    grunt.registerTask('default', ['test']);
};
