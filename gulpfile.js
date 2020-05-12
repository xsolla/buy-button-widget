var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var sassify = require('sassify');
var stringify = require('stringify');
var watchify = require('watchify');
var gulpif = require('gulp-if');
var babelify = require('babelify');
var fs = require('fs');

var devMode = process.argv.slice(2).indexOf('--dev') !== -1;

function setupBrowserify(watch) {
    var bundleOptions = {
        cache: {},
        packageCache: {},
        paths: [
            './src',
            './bower_components',
            './bower_components/xsolla-paystation-widget/src',
            './bower_components/xsolla-login-js-sdk/src'
        ],
        standalone: 'XPay2PlayWidget',
        fullPaths: false,
        debug: true
    };

    var bundler = browserify('./src/main.js', bundleOptions);
    bundler.require('./bower_components/xsolla-paystation-widget/src/main.js', {expose: 'paystation-embed-app'});
    bundler.require('./bower_components/xsolla-login-js-sdk/src/main.js', {expose: 'xsolla-login-app'});
    bundler.require('./bower_components/react/react.production.min.js', {expose: 'react'});
    bundler.require('./bower_components/react/react-dom.production.min.js', {expose: 'react-dom'});
    bundler.require('./bower_components/react/react-dom-server.browser.production.min.js', {expose: 'react-dom-server'});
    bundler.require('./bower_components/polyglot/index.js', {expose: 'polyglot'});
    bundler.require('./bower_components/tether/dist/js/tether.js', {expose: 'tether'});
    bundler.require('./bower_components/react-onclickoutside/index.js', {expose: 'react-onclickoutside'});
    bundler.require('./bower_components/isRetina.js/isRetina.js', {expose: 'is-retina-js'});
    bundler.require('./bower_components/svg-injector/svg-injector.js', {expose: 'svg-injector'});
    bundler.require('./node_modules/currency-format/currency-format.json', {expose: 'currency-format.json'});
    bundler.require('./node_modules/currency-number-format/currency-number-format.json', {expose: 'currency-number-format.json'});
    bundler.require('./src/main.js', {expose: 'xsolla-pay2play-widget'});

    bundler.transform(sassify, {
        outputStyle: 'compressed',
        base64Encode: false,
        'auto-inject': true,
        sourceMap: false,
        sourceMapEmbed: false
    });

    bundler.transform(stringify({
        extensions: ['.svg'],
        minify: true,
        minifier: {
            extensions: ['.svg'],
            options: {
                removeComments: true,
                removeCommentsFromCDATA: true,
                removeCDATASectionsFromCDATA: true,
                collapseWhitespace: true
            }
        }
    }));

    bundler.transform(
        babelify,
        {
            presets: ["@babel/preset-react", "@babel/preset-env"],
        }
    );

    if (watch) {
        bundler = watchify(bundler);
        bundler.on('update', function () {  // on any dep update, runs the bundler
            runBundle(bundler, watch);
        });
    }

    runBundle(bundler, watch);

    return bundler;
}

function runBundle(bundler, watch) {
    return bundler.bundle()
    // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('widget.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(gulpif(!devMode, buffer()))
        .pipe(gulpif(!devMode, rename('widget.min.js')))
        .pipe(gulpif(!devMode, sourcemaps.init({loadMaps: true}))) // loads map from browserify file
        .pipe(gulpif(!devMode, uglify()))
        .pipe(gulpif(!devMode, sourcemaps.write('./', {includeContent: true, sourceRoot: '.', debug: false}))) // writes .map file
        .pipe(gulpif(!devMode, gulp.dest('./dist')))
        .pipe(gulpif(watch, browserSync.reload({stream: true, once: true})));
}

gulp.task('build', function () {
    // Stamp current version
    var version = require('./src/version.js');

    var readme = fs.readFileSync('./README.md', 'utf8');
    readme = readme.replace(/(static\.xsolla\.com\/embed\/pay2play\/)(\d+\.\d+\.[\w\-\.]+)(\/widget\.min\.js)/gi, '$1' + version + '$3');
    fs.writeFileSync('./README.md', readme);

    var packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    packageJSON.version = version;
    fs.writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2));

    setupBrowserify(false);
});

gulp.task('browser-sync', function () {
    browserSync({
        startPath: '/index.html',
        server: {
            baseDir: ['example', 'dist']
        },
        port: 3150,
        ghostMode: false
    });
});

gulp.task('serve', ['browser-sync'], function () {
    var bundler = setupBrowserify(true);

    gulp.watch(['example/*.html']).on('change', browserSync.reload); //all the other files are managed by watchify
    gulp.watch(['src/styles/**/*.scss']).on('change', function () {
        bundler.emit('update');
    });
});
