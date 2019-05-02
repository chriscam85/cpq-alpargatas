const del = require('del')
const gulp = require('gulp')
const babel = require('gulp-babel')
const stripDebug = require('gulp-strip-debug')
const concat = require('gulp-concat')
const pump = require('pump')
const uglifyjs = require('uglify-js')
const composer = require('gulp-uglify/composer')
const minify = composer(uglifyjs, console)
const cleanCss = require('gulp-clean-css')

const PATH = {
    css: 'styles/*.css',
    js: [
        'CustomJS/funcionesAuxiliares.js', 
        'CustomJS/integraciones.js',
        'CustomJS/Paginador.js',
        'CustomJS/Pivo.js',
        'CustomJS/tamanhosOcultos.js',
        'CustomJS/totalDigitado.js',
        'CustomJS/Disponibilidade2.js',
        'CustomJS/validadorCelda.js',
        'CustomJS/envioDatos.js'
    ],
    libs: 'javascript/*.js',
    output: 'build'
}

function tratamentJs(input, output) {
    return [
        gulp.src(input),
        babel({ presets: ['@babel/env'] }),
        concat(output),
        stripDebug(),
        minify(),
        gulp.dest(`${PATH.output}/js`)
    ]
}

gulp.task( 'delete', () => del(PATH.output) );

gulp.task('minify-scripts', (cb) => pump( tratamentJs(PATH.js, 'bundle.js'), cb ) )

gulp.task('minify-libs', (cb) => pump( tratamentJs(PATH.libs, 'libs.js'), cb ) )

gulp.task('minify-css', () => 
    gulp.src(PATH.css)
    .pipe( concat('all.css'))
    .pipe( cleanCss({compatibility: 'ie8'}) )
    .pipe( gulp.dest( `${PATH.output}/css`) )
)

gulp.task('default', gulp.series( 'delete', gulp.parallel('minify-css', 'minify-scripts', 'minify-libs') ))