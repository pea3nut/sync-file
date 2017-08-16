#!/usr/bin/env node

const Fs =require('fs-extra');
const Join =require('path').join;


var args =process.argv.slice(2);
var originFile =args[0];
var targetFile =args[1];


Fs.watch(originFile ,function(eventType ,filename){
    if(Fs.existsSync(Join(originFile,filename))){
        Fs.readFile(Join(originFile,filename) ,function(error ,data){
            Fs.writeFile(Join(targetFile,filename),data,function(){
                console.log(`sync ${filename}`);
            })
        });
    }else{
        Fs.unlink(Join(targetFile,filename),function(){
            console.log(`remove ${filename}`);
        });
    }
});
Fs.removeSync(targetFile);
console.log(`remove ${targetFile}`);
Fs.copySync(originFile,targetFile);
console.log(`copy ${originFile} -> ${targetFile}`);