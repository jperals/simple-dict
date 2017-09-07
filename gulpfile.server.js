'use strict';

const babel = require('gulp-babel')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const Cache = require('gulp-file-cache')
const del = require('del')
const fs = require('fs')
const gulp = require('gulp')
const livereload = require('gulp-livereload')
const nodemon = require('gulp-nodemon')
const notify = require('gulp-notify')
const runSequence = require('run-sequence')
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')
const sourcemaps  = require('gulp-sourcemaps')

const renderPage = require('./src/renderPage')

const { buildDir, generateClientFiles, generateVendorFiles } = require('./gulpfile.common')

const serverDir = buildDir + '/server'

const cache = new Cache()

// Remove all content inside the server build, except the server build directory itself
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

// Reload the development server
gulp.task('server:reload', function(callback) {
    return runSequence('server:clean', 'server:build', ['server:sass', 'server:data', 'server:vendor', 'server:client'], callback)
})

// Start a server that will reload on source changes
gulp.task('server:serve', ['server:build', 'server:client'], function () {
    livereload.listen()
    const stream = nodemon({
        script: serverDir + '/server.js',
        watch: 'src',
        ext: 'js',
        tasks: ['server:reload']
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

// Copy dictionary yaml files
gulp.task('server:data', function () {
    return gulp.src('./data/**')
        .pipe(gulp.dest(serverDir + '/data'))
})

// Copy third-party files
gulp.task('server:vendor', function () {
    return generateVendorFiles(serverDir + '/static')
});

// Client-side files
gulp.task('server:client', function () {
    return generateClientFiles(serverDir + '/static')
        .pipe(livereload())
})

// Serve a development build that will regenerate on changes
gulp.task('serve', function(callback) {
    runSequence('server:clean', 'server:sass', 'server:sass-watch', ['server:data', 'server:vendor'], 'server:serve', callback)
})
