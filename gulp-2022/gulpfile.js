import gulp from 'gulp';
import {path} from './gulp/config/path.js';
import {plugins} from "./gulp/config/plugins.js";

/*TASKS*/
import {copy} from "./gulp/tasks/copy.js";
import {reset} from "./gulp/tasks/reset.js";
import {html} from "./gulp/tasks/html.js";
import {server} from "./gulp/tasks/server.js";
import {scss} from "./gulp/tasks/scss.js";
import {js} from "./gulp/tasks/js.js";
import {images} from "./gulp/tasks/images.js";
import {otfToTtf, ttfToWoff, fontsStyle} from "./gulp/tasks/fonts.js";
import {svgSprive} from "./gulp/tasks/svgSprive.js";
import {zip} from "./gulp/tasks/zip.js";
import {ftp} from "./gulp/tasks/ftp.js";

global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path: path,
    gulp: gulp,
    plugins: plugins,
}

function watcher() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html) /*для автоматического изменения на FTP сервере последнее словозаменить на: (path.watch.html, gulp.series(ftml, ftp)) */;
    gulp.watch(path.watch.scss, scss) /*для автоматического изменения на FTP сервере последнее словозаменить на: (path.watch.scss, gulp.series(scss, ftp)) */;
    gulp.watch(path.watch.js, js) /*для автоматического изменения на FTP сервере последнее словозаменить на: (path.watch.js, gulp.series(js, ftp)) */;
    gulp.watch(path.watch.images, images) /*для автоматического изменения на FTP сервере последнее словозаменить на: (path.watch.images, gulp.series(images, ftp)) */;
}

export {svgSprive}

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, js, images));

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

export {dev}
export {build}
export {deployZIP}
export {deployFTP}

gulp.task('default', dev);