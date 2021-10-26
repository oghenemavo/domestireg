// Load Gulp...of course
const { src, dest, task, watch, series, parallel } = require('gulp');

// CSS related plugins
var sass         = require( 'gulp-sass' );
var autoprefixer = require( 'gulp-autoprefixer' );

// JS related plugins
var uglify       = require( 'gulp-uglify' );
var babelify     = require( 'babelify' );
var browserify   = require( 'browserify' );
var source       = require( 'vinyl-source-stream' );
var buffer       = require( 'vinyl-buffer' );
var stripDebug   = require( 'gulp-strip-debug' );

// Utility plugins
var rename       = require( 'gulp-rename' );
var sourcemaps   = require( 'gulp-sourcemaps' );
var notify       = require( 'gulp-notify' );
var plumber      = require( 'gulp-plumber' );
var options      = require( 'gulp-options' );
var gulpif       = require( 'gulp-if' );

// Browers related plugins
var browserSync  = require( 'browser-sync' ).create();

const paths = {
	styles: {
		src: './src/scss/style.scss',
		dist: './app/css/'
	},
	scripts: {
		src: './src/js/',
		dist: './app/assets/js/',
		files: ['main.js'],
	},
	images: {
		src: './src/images/**/*',
		dist: './app/images/'
	},
	svg: {
		src: './src/svg/**/*',
		dist: './app/svg/'
	},
	fonts: {
		src: './src/fonts/**/*',
		dist: './app/fonts/'
	},
	html: {
		src: './src/**/*.html',
		dist: './app/'
	},
	map: './',
};

const watches = {
	styles: './src/scss/**/*.scss',
	scripts: './src/js/**/*.js',
	images: './src/images/**/*.*',
	svg: './src/svg/**/*.svg',
	fonts: './src/fonts/**/*.*',
	html: './src/**/*.html',
};

// Tasks
async function browser_sync() {
	browserSync.init({
		server: {
			baseDir: './app/'
		}
	});
}

async function reload(done) {
	browserSync.reload();
	done();
}

async function css(done) {
	src( [ paths.styles.src ], ['allowEmpty'] )
	.pipe(plumber({ errorHandler: function(err) {
		notify.onError({
			title: "Gulp error in " + err.plugin,
			message:  err.toString()
		})(err);
	}}))
	.pipe( sourcemaps.init() )
	.pipe( sass({
		errLogToConsole: true,
		outputStyle: 'expanded'
	}).on('error', sass.logError) ) // changed
	// .on( 'error', console.error.bind( console ) ) // changed
	.pipe( autoprefixer() )
	.pipe(dest(paths.styles.dist)) // changed
	.pipe( sass({
		errLogToConsole: true,
		outputStyle: 'compressed'
	}).on('error', sass.logError) )
	// .on( 'error', console.error.bind( console ) )
	.pipe( autoprefixer() )
	.pipe( rename( { suffix: '.min' } ) )
	.pipe( sourcemaps.write( paths.map ) )
	.pipe( dest( paths.styles.dist ) )
	.pipe( browserSync.stream() );
	done();
};

async function js(done) {
	paths.scripts.files.map( function( entry ) {
		return browserify({
			entries: [paths.scripts.src + entry]
		})
		.transform( babelify, { presets: [ '@babel/preset-env' ] } )
		.bundle()
		.pipe(plumber({ errorHandler: function(err) {
			notify.onError({
				title: "Gulp error in " + err.plugin,
				message:  err.toString()
			})(err);
		}}))
		.pipe( source( entry ) )
		.pipe(dest(paths.scripts.dist)) // changed
		.pipe( rename( {
			extname: '.min.js'
        } ) )
		.pipe( buffer() )
		.pipe( gulpif( options.has( 'production' ), stripDebug() ) )
		.pipe( sourcemaps.init({ loadMaps: true }) )
		.pipe( uglify() )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( dest( paths.scripts.dist ) )
		.pipe( browserSync.stream() );
	});
	done();
};

async function triggerPlumber( src_file, dest_file ) {
	return src( src_file )
		.pipe( plumber() )
		.pipe( dest( dest_file ) );
}

async function images() {
	return triggerPlumber( paths.images.src, paths.images.dist );
};

async function svg() {
	return triggerPlumber( paths.svg.src, paths.svg.dist );
};

async function fonts() {
	return triggerPlumber( paths.fonts.src, paths.fonts.dist );
};

async function html() {
	return triggerPlumber( paths.html.src, paths.html.dist );
};

async function watch_files() {
	// watch(watches.styles, series(css, reload));
	watch(watches.scripts, series(js, reload));
	// watch(watches.images, series(images, reload));
	// watch(watches.svg, series(svg, reload));
	// watch(watches.fonts, series(fonts, reload));
	watch(watches.html, series(html, reload));
	src(paths.scripts.dist + 'main.min.js')
		.pipe( notify({ message: 'Gulp is Watching, Happy Coding!' }) );
}

task("css", css);
task("js", js);
task("images", images);
task("fonts", fonts);
task("html", html);
task("default", parallel(js, html));
task("watch", parallel(browser_sync, watch_files));