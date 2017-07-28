'use strict';

const del = require('del')
const fs = require('fs')
const gulp = require('gulp')
const babel = require('gulp-babel')
const Cache = require('gulp-file-cache')
const ghpages = require('gh-pages');
const livereload = require('gulp-livereload')
const nodemon = require('gulp-nodemon')
const notify = require('gulp-notify')
const renderPage = require('./src/renderPage')
const sass = require('gulp-sass')

const dictPath = './data/dicts'

const cache = new Cache()

gulp.task('static:build', function () {
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
                                }
                            })
                        })
                    })
                }
            })
        }
    })
})

gulp.task('app:compile', function () {
    const stream = gulp.src('./src/**/*.js')
        .pipe(babel({
            "presets": ["react", "es2015", "stage-2"]
        }))
        .pipe(gulp.dest('./dist'))
    return stream
})

gulp.task('app:serve', ['app:compile'], function () {
    livereload.listen()
    const stream = nodemon({
        script: 'dist/server.js',
        watch: 'src',
        ext: 'js scss',
        tasks: ['app:compile']
    }).on('restart', function(){
        gulp.src('dist/server.js')
            .pipe(livereload())
            .pipe(notify('Reloading page, please wait...'));
    })
    return stream
})


gulp.task('sass:build', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./static/css'));
})

gulp.task('sass:compile', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
})

gulp.task('sass:watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['sass:compile'])
})

gulp.task('clean:app', function () {
    return del(['dist/**', '!dist'])
})

gulp.task('clean:static', function () {
    return del(['static/**', '!static'])
})

gulp.task('gh-pages', function () {
    return ghpages.publish('static', function(err) {
        console.error(err)
    })
})


gulp.task('clean', ['clean:app', 'clean:static'])
gulp.task('build', ['clean:static', 'sass:build', 'static:build'])
gulp.task('serve', ['clean:app', 'sass:compile', 'sass:watch', 'app:serve'])
gulp.task('publish', ['build', 'gh-pages'])