'use strict';

const fs = require('fs')
const gulp = require('gulp')
const sass = require('gulp-sass');
const initServer = require('./server')
const renderPage = require('./renderPage')

const dictPath = './data/dicts'

gulp.task('react:build', function () {
    fs.readdir(dictPath, function(err, files) {
        if(err) {
            console.error(error)
            return
        }
        for(const file of files) {
            fs.stat(dictPath + '/' + file, function(err, stats) {
                if(err) {
                    console.error(error)
                    return
                }
                if(!stats.isDirectory()) {
                    fs.mkdir('dist', function () {
                        const dictId = file.split('.')[0]
                        console.log('Building dictionary:', dictId)
                        fs.mkdir('dist/' + dictId, function () {
                            const html = renderPage({dictId})
                            return fs.writeFile('dist/' + dictId + '/index.html', html, function(err) {
                                if(err) {
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

gulp.task('react:serve', function () {
    initServer()
})


gulp.task('sass:compile', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./static/css'));
})

gulp.task('sass:build', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/static/css'));
})

gulp.task('sass:watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['sass:compile'])
})

gulp.task('build', ['sass:build', 'react:build'])
gulp.task('serve', ['sass:compile', 'sass:watch', 'react:serve'])
