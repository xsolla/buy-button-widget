const gulp = require('gulp');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const sassify = require('sassify');
const stringify = require('stringify');
const watchify = require('watchify');
const gulpif = require('gulp-if');
const babelify = require('babelify');
const fs = require('fs');

const devMode = process.argv.slice(2).indexOf('--dev') !== -1;

function setupBrowserify(watch) {
    const bundleOptions = {
        cache: {},
        packageCache: {},
        paths: [
            './src',
            './bower_components',
            './bower_components/xsolla-paystation-widget/src',
            './bower_components/xsolla-login-js-sdk/src'
        ],
        standalone: 'XBuyButtonWidget',
        fullPaths: false,
        debug: true
    };

    let bundler = browserify('./src/main.js', bundleOptions);
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
    bundler.require('./src/main.js', {expose: 'xsolla-pay2play-widget'}); // Оставляем pay2play - иначе путается порядок загрузки и первым грузится Xsolla login

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

gulp.task('build', (done) => {
    // Stamp current version
    const version = require('./src/version.js');

    let readme = fs.readFileSync('./README.md', 'utf8');
    readme = readme.replace(/(cdn\.xsolla\.net\/embed\/buy-button\/)(\d+\.\d+\.[\w\-\.]+)(\/widget\.min\.js)/gi, '$1' + version + '$3');
    fs.writeFileSync('./README.md', readme);

    const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    packageJSON.version = version;
    fs.writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2));

    setupBrowserify(false);
    done();
});

gulp.task('browser-sync', (done) => {
    browserSync({
        startPath: '/index.html',
        server: {
            baseDir: ['example', 'dist']
        },
        port: 3150,
        ghostMode: false
    });

    browserSync.watch('example/*.html').on('change', browserSync.reload);
    browserSync.watch('src/styles/**/*.scss').on('change', browserSync.reload);

    done();
});

gulp.task('serve', gulp.parallel('browser-sync', (done) => {
    setupBrowserify(true);
    done();
}));
