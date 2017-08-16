#!/usr/bin/env node

const Fs =require('fs-extra');
const Path =require('path');
const Join =Path.join;
const Resolve =Path.resolve;
const Chokidar = require('chokidar');

var args =process.argv.slice(2);
var OriginFile =Resolve(args[0]);
var TargetFile =Resolve(args[1]);

const fileCount ={};


// Fs.watch(originFile ,function(eventType ,filename){
//     if(Fs.existsSync(Join(originFile,filename))){
//         if(!(filename in fileCount)){
//             fileCount[filename]=0;
//         };
//         fileCount[filename]++;
//         if(fileCount[filename]%2===1){
//             console.log(`async ${filename}`);
//             Fs.copy(
//                 Join(originFile,filename),
//                 Join(targetFile,filename)
//             );
//         }
//     }else{
//         Fs.unlink(Join(targetFile,filename),function(){
//             console.log(`remove ${filename}`);
//         });
//     }
// });
Fs.removeSync(TargetFile);
console.log(`remove ${toRelativePath(TargetFile)}`);
Fs.copySync(OriginFile,TargetFile);
console.log(`copy   ${toRelativePath(OriginFile)} -> ${toRelativePath(TargetFile)}`);




var watcher =Chokidar.watch(OriginFile);
watcher.on('all',function(eventType ,filename){
    var origin =Resolve(filename);
    var target =Join(
        TargetFile,
        Resolve(filename).replace(OriginFile,'')
    );

    if(['add','change'].includes(eventType)){
        Fs.copy(origin,target,function(error){
            if(error){
                console.log(error);
            }else{
                console.log(`async  ${toRelativePath(origin)} -> ${toRelativePath(target)}`);
            };
        });
    };
    if(['unlink'].includes(eventType)){
        Fs.unlink(target,function(){
            console.log(`remove ${toRelativePath(target)}`);
        });
    };
});


function toRelativePath(path){
    return path.replace(Resolve('./'),'');
}