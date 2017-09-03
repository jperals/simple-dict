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

const serverDir = './build/server'
const staticDir = './build/static'
const dictPath = './data/dicts'
const vendorPackages = [
    'js-yaml',
    'react',
    'react-dom',
    'redux',
    'react-redux'
]

const cache = new Cache()

// Remove all content inside `dist`, but the `dist` directory itself
gulp.task('server:clean', function () {
    return del([serverDir + '/**', '!' + serverDir ])
})

// Generate a build to be served via Express
gulp.task('server:build', function () {
    const stream = gulp.src('./src/**/*.js')
        .pipe(babel({
            "presets": ["react", "es2015", "stage-2"]
        }))
        .pipe(gulp.dest(serverDir))
    return stream
})

// Start a server that serves files from `dist` and will reload on source changes
gulp.task('server:serve', ['server:build', 'server:client'], function () {
    livereload.listen()
    const stream = nodemon({
        script: serverDir + '/server.js',
        watch: 'src',
        ext: 'js scss',
        tasks: ['server:clean', 'server:build', 'server:client']
    }).on('restart', function(){
        gulp.src(serverDir + '/server.js')
            .pipe(livereload())
            .pipe(notify('Reloading page, please wait...'));
    })
    return stream
})

// Generate css files for the server build
gulp.task('server:sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(serverDir + '/static/css'));
})

// Watch for changes in scss files, to compile again
gulp.task('server:sass-watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['server:sass'])
})

gulp.task('server:data', function () {
    return gulp.src('./data/**')
        .pipe(gulp.dest(serverDir + '/data'))
})

gulp.task('server:vendor', function () {
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
        .pipe(gulp.dest(serverDir + '/static'));
});

gulp.task('server:client', function () {
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
        .pipe(gulp.dest(serverDir + '/static'))
        .pipe(livereload())
})

// Remove all content inside `static`, but the `static` directory itself
gulp.task('static:clean', function () {
    return del([staticDir + '/**', '!static'])
})

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
                    fs.mkdir(staticDir, function () {
                        const dictId = file.split('.')[0]
                        console.log('Building dictionary:', dictId)
                        fs.mkdir(staticDir + '/' + dictId, function () {
                            const html = renderPage({dictId})
                            return fs.writeFile(staticDir + '/' + dictId + '/index.html', html, function (err) {
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

// Generate css files for the static build
gulp.task('static:sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./static/css'));
})

// Publish to Github
gulp.task('gh-pages', function () {
    return ghpages.publish(staticDir, function(err) {
        console.error(err)
    })
})

gulp.task('clean', ['server:clean', 'static:clean'])

gulp.task('build', function(callback) {
    runSequence('static:clean', ['sass:build', 'static:build'], callback)
})

gulp.task('serve', function(callback) {
    runSequence('server:clean', 'server:sass', 'server:sass-watch', ['server:data', 'server:vendor'], 'server:serve', callback)
})

gulp.task('publish', function(callback) {
    runSequence('build', 'gh-pages', callback)
})

gulp.task('default', ['serve'])
