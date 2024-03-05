module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                files: {
                    'dev/styles/main.css': 'src/styles/main.less'
                }
            },
            production: {
                options: {
                    compress: true,
                },
                files: {
                    'dist/styles/main.min.css': 'src/styles/main.less'
                }
            }
        },
        watch: {
            less: {
                files: ['src/styles/**/*.less'],
                tasks: ['less:development']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
        },
        replace: { //configuração do plugin
            dev: {
                options: {
                    patterns: [ //encontra palavras pro plugin substituir
                        {
                            match: 'ENDERECO_DO_CSS', //será substituída
                            replacement: './styles/main.css' //irá substituir - já será enviado para a pasta dev. não precisa indicar no link da pasta
                        },
                        {
                            match: 'ENDERECO_DO_JS', //será substituída
                            replacement: '../src/scripts/main.js' //irá substituir - já será enviado para a pasta dev. não precisa indicar no link da pasta
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'],
                        dest: 'dev/'
                    }
                ]
            },
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.min.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS', //será substituída
                            replacement: './scripts/main.min.js' //irá substituir - já será enviado para a pasta dev. não precisa indicar no link da pasta
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        htmlmin: { //minificação do html
            dist:  { //ambiente de distribuição
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { //1. minificação atráves de uma pasta temporária (pré-build) 2. substituição
                    'prebuild/index.html': 'src/index.html'
                }
            }
        },
        clean: ['prebuild'],
        uglify: {
            target: {
                files: {
                    'dist/scripts/main.min.js': 'src/scripts/main.js'
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-less'); //carregando o plugin
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']);
}