/**
 * Created by Salifukayta on 18/07/2015.
 */

module.exports = function(grunt) {

    grunt.initConfig({
        nggettext_extract: {
            pot: {
                files: {
                    //add error msgs
                    'po/template.pot': ['www/templates/*/*.html', 'www/templates/*.html']
                }
            },
        },
        nggettext_compile: {
            all: {
                options: {
                    format: "json"
                },
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: "po",
                        dest: "www/languages",
                        src: ["*.po"],
                        ext: ".json"
                    }
                ]
            },
        },

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-angular-gettext');

    // Default task(s).
    grunt.registerTask('default', ['nggettext_extract', 'nggettext_compile']);
};