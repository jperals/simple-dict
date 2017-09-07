const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const gulp = require('gulp')
const source = require('vinyl-source-stream')
const sourcemaps  = require('gulp-sourcemaps')

const buildDir = './build'
const vendorPackages = [
    'js-yaml',
    'react',
    'react-dom',
    'redux',
    'react-redux'
]

function generateClientFiles(dest) {
    const compiled = browserify('src/client.js')
        .transform("babelify", {presets: ["react", "es2015", "stage-2"]})
    vendorPackages.forEach(function (id) {
        compiled.external(id)
    })
    return compiled.bundle()
        .on('error', function(err){
            console.error(err);
        })
        // .pipe(buffer())
        // .pipe(minify())
        // .pipe(argv.production ? minify() : gutil.noop())
        .pipe(source('client.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true, debug: true}))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(dest))
}

function generateVendorFiles(dest) {
    return browserify()
        .require(vendorPackages)
        .bundle()
        .on('error', function(err){
            console.error(err)
        })
        // .pipe(buffer())
        // .pipe(minify())
        // .pipe(argv.production ? minify() : gutil.noop())
        .pipe(source('vendor.js'))
        .pipe(gulp.dest(dest))
}

module.exports = {
    buildDir,
    vendorPackages,
    generateClientFiles,
    generateVendorFiles
}
