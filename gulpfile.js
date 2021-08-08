const { src, dest, watch, series } = require("gulp");
const autoprefixer = require("autoprefixer");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browserSync = require("browser-sync").create();
const mode = require("gulp-mode")();
const sourcemaps = require("gulp-sourcemaps");

console.log("mode :>> ", mode.development());

// Sass task
function scssTask() {
	return src("app/scss/style.scss", { sourcemaps: true })
		.pipe(mode.development(sourcemaps.init()))
		.pipe(sass().on("error", sass.logError))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(mode.development(sourcemaps.write()))
		.pipe(dest("dist", { sourcemaps: "." }));
}

// JavaScript Task
function jsTask() {
	return src("app/js/script.js", { sourcemaps: true })
		.pipe(terser())
		.pipe(dest("dist", { sourcemaps: "." }));
}

// BrowsersyncSerce task
function browserSyncServe(callback) {
	browserSync.init({
		server: {
			baseDir: "./",
		},

		port: 8080,
		open: true,
		notify: {
			styles: {
				top: "auto",
				bottom: "0",
			},
		},
	});
	callback();
}

function broserSyncReload(callback) {
	browserSync.reload();
	callback();
}

// Watch Task
function watchTask() {
	watch("*.html", broserSyncReload);
	watch(
		["app/**/*.scss", "app/**/*.js"],
		series(scssTask, jsTask, broserSyncReload)
	);
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);
