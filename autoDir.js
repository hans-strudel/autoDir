// autoDir
// Hans Strausl 2016
var fs = require('fs'),
	path = require('path');

var dir = process.argv[2] || process.cwd();
var sep = path.sep;

mapDir(dir, transFiles);

function mapDir(dir, cb){  // callback(filePath, isDirectory, fileInfo)
	var dirList = [];
	var fileList= [];
	fs.readdir(dir, function(err, files){
		if (err) throw new Error(err);
		files.forEach(function(file, i){
			var fullPath = dir + sep + file;
			fs.stat(fullPath, function(err, info){
				if (err) throw new Error(err);
				if (info.isDirectory()){
					dirList.push(fullPath);
				} else {
					fileList.push(fullPath);
				}
				if (i == files.length - 1){ // last file
					cb(fileList, dirList);
				}
			})
		})
	})
}

function transFiles(fileList, dirList){
	fileList.forEach(function(file){
		var fileInfo = path.parse(file);
		console.log(fileInfo);
		var dirName = fileInfo.dir + sep + fileInfo.ext.substr(1)
		if (dirList.indexOf(dirName) > -1){
			console.log('dir exists');
			moveFile(file, dirName);
		} else {
			console.log('no dir'); // make dir and move
			fs.mkdir(dirName, function(err, info){
				if (err && err.code !== 'EEXIST') throw new Error(err);
				dirList.push(dirName);
				moveFile(file, dirName);
			})
		}
	})
}

function moveFile(file, dir){
	fs.rename(file, dir + sep + path.parse(file).base, function(err){
		if (err) throw new Error(err);
	})
}