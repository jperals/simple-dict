'use strict';

const staticTasks = require('./gulpfile.static')
const serverTasks = require('./gulpfile.server')

const ghpages = require('gh-pages')
const gulp = require('gulp')
const runSequence = require('run-sequence')

const { buildDir } = require('./gulpfile.common')
const staticDir = buildDir + '/static'

// Remove all content inside the server build, except the server build directory itself
// Publish to Github
gulp.task('gh-pages', function () {
    return ghpages.publish(staticDir, function(err) {
        console.error(err)
    })
})

// Clean both the server build and the static build
gulp.task('clean', ['server:clean', 'static:clean'])

// Publish the static build to GitHub Pages
gulp.task('publish', function(callback) {
    runSequence('build', 'gh-pages', callback)
})

gulp.task('default', ['serve'])
