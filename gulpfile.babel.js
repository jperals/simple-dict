'use strict';

const fs = require('fs')
const gulp = require('gulp')
const renderPage = require('./renderPage')

const dictPath = './data/dicts'

gulp.task('build', function () {
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
