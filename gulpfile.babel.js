'use strict';

const babel = require('gulp-babel')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const Cache = require('gulp-file-cache')
const del = require('del')
const fs = require('fs')
const ghpages = require('gh-pages');
const gulp = require('gulp')
const livereload = require('gulp-livereload')
const nodemon = require('gulp-nodemon')
const notify = require('gulp-notify')
const runSequence = require('run-sequence')
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')
const sourcemaps  = require('gulp-sourcemaps')

const renderPage = require('./src/renderPage')

const dictPath = './data/dicts'
const thirdPartyPackages = [
    'js-yaml',
    'react',
    'react-dom',
    'redux',
    'react-redux'
]

const cache = new Cache()

// Generate a static build in the `static` directory
gulp.task('static:build', function (callback) {
    fs.readdir(dictPath, function (err, files) {
        if (err) {
            console.error(error)
            return
        }
        for (const file of files) {
            fs.stat(dictPath + '/' + file, function (err, stats) {
                if (err) {
                    console.error(error)
                    return
                }
                if (!stats.isDirectory()) {
                    fs.mkdir('static', function () {
                        const dictId = file.split('.')[0]
                        console.log('Building dictionary:', dictId)
                        fs.mkdir('static/' + dictId, function () {
                            const html = renderPage({dictId})
                            return fs.writeFile('static/' + dictId + '/index.html', html, function (err) {
                                if (err) {
                                    console.error(err)
                                }
                                else {
                                    console.log('Done!')
                                    if(typeof callback === "function") {
                                        callback()
                                    }
                                }
                            })
                        })
                    })
                }
            })
        }
    })
})

// Generate a build to be served via Express in the `dist` directory
gulp.task('app:compile', function () {
    const stream = gulp.src('./src/**/*.js')
        .pipe(babel({
            "presets": ["react", "es2015", "stage-2"]
        }))
        .pipe(gulp.dest('./dist'))
    return stream
})

// Start a serve that serves files from `dist` and will reload on source changes
gulp.task('app:serve', ['app:compile', 'client'], function () {
    livereload.listen()
    const stream = nodemon({
        script: 'dist/server.js',
        watch: 'src',
        ext: 'js scss',
        tasks: ['app:compile', 'client']
    }).on('restart', function(){
        gulp.src('dist/server.js')
            .pipe(livereload())
            .pipe(notify('Reloading page, please wait...'));
    })
    return stream
})

// Generate css files under `static`
gulp.task('sass:build', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./static/css'));
})

// Generate css files under `dist`
gulp.task('sass:compile', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
})

// Watch for changes in scss files, to compile again
gulp.task('sass:watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['sass:compile'])
})

// Remove all content inside `dist`, but the `dist` directory itself
gulp.task('clean:app', function () {
    return del(['dist/**', '!dist'])
})

// Remove all content inside `static`, but the `static` directory itself
gulp.task('clean:static', function () {
    return del(['static/**', '!static'])
})

// Publish to Github
gulp.task('gh-pages', function () {
    return ghpages.publish('static', function(err) {
        console.error(err)
    })
})

gulp.task('vendor', function () {
    return browserify()
        .require(thirdPartyPackages)
        .bundle()
        .on('error', function(err){
            console.error(err)
        })
        // .pipe(buffer())
        // .pipe(minify())
        // .pipe(argv.production ? minify() : gutil.noop())
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('./static'));
});

gulp.task('client', function () {
    const compiled = browserify('src/client.js')
        .transform("babelify", {presets: ["react", "es2015", "stage-2"]})
    thirdPartyPackages.forEach(function (id) {
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
    .pipe(gulp.dest('./static'))
    .pipe(livereload())
})

gulp.task('clean', ['clean:app', 'clean:static'])

gulp.task('build', function(callback) {
    runSequence('clean:static', ['sass:build', 'static:build'], callback)
})

gulp.task('serve', function(callback) {
    runSequence('clean:app', 'sass:compile', 'sass:watch', 'vendor', 'app:serve', callback)
})

gulp.task('publish', function(callback) {
    runSequence('build', 'gh-pages', callback)
})
