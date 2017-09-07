const del = require('del')
const fs = require('fs')
const gulp = require('gulp')
const runSequence = require('run-sequence')
const sass = require('gulp-sass')
import yaml from 'js-yaml'

const { buildDir, generateClientFiles, generateVendorFiles } = require('./gulpfile.common')
const renderPage = require('./src/renderPage')

const dictPath = './data/dicts'
const staticDir = buildDir + '/static'

// Remove all content inside the static build, except the static build directory itself
gulp.task('static:clean', function () {
    return del([staticDir + '/**', '!' + staticDir])
})

// Generate a static build
gulp.task('static:build', function (callback) {
    fs.readdir(dictPath, function (err, files) {
        if (err) {
            console.error(error)
            return
        }
        // Create a build in a separate directory for each existing dictionary
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
                        const dictContent = yaml.safeLoad(fs.readFileSync(dictPath + '/' + file))
                        fs.mkdir(staticDir + '/' + dictId, function () {
                            const html = renderPage({dictId, dictContent})
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
        .pipe(gulp.dest(staticDir + '/css'))
})

// Copy data files
gulp.task('static:data', function () {
    return gulp.src('./data/**')
        .pipe(gulp.dest(staticDir + '/data'))
})

// Copy third-party files
gulp.task('static:vendor', function () {
    return generateVendorFiles(staticDir)
});

// Copy clilent-side files
gulp.task('static:client', function () {
    return generateClientFiles(staticDir)
});

// Generate a static build, e.g. for publishing
gulp.task('build', function(callback) {
    runSequence('static:clean', ['static:sass', 'static:build', 'static:data', 'static:vendor', 'static:client'], callback)
})

