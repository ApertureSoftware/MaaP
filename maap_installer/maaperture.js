#!/usr/bin/env node

/**
 * File: maaperture.js
 * Module: maap_installer
 * Author: Alberto Garbui
 * Created: 02/05/14
 * Version: 0.1
 * Description: maaperture installer
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
 
"use strict";

var fs = require('fs');
var program = require('commander');
var ncp = require('ncp').ncp;

var version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;
var name = "Maaperture v" + version;
var description = "MongoDB as an Admin Platform - Aperture Software";

var printHelpTitle = function() {
	console.log('');
	console.log('  --------------------------------------------------');
	console.log('   ' + name);
	console.log('');
	console.log('   ' + description);
	console.log('  --------------------------------------------------');
};

//cambia una riga del file specificato sostituendola con quella passata in ingresso
//filePath = path del file da modificare
//string2find = stringa con la quale inizia la riga da modificare
//newString = stringa con i nuovi caratteri da aggiungere 
//restituisce true se ha trovato la stringa
var changeFileRow = function(filePath, string2find, newString) {
	
	var buffer = '';
	var found = false;
	fs.readFileSync(filePath).toString().split('\n').forEach(function (line) { 
		
		var cursor = line.indexOf(string2find);
		if(cursor > -1)
		{
			line = line.substring(0, cursor) + newString;		
			found = true;
		}
		buffer += line.toString() + '\n';
	});
	
	//rimuovo l'ultimo \n 
	buffer = buffer.substring(0, buffer.length - 1);
	
	//scrivo il file aggiornato
	if(found)
	{
		var done = false;
		fs.writeFile(filePath, buffer, 'utf-8', function (err) {
			if (err) {
				console.error('error updating file: ' + filePath);
				throw err;
			} 
			done = true;	
		});	
		
		while(!done){require('deasync').sleep(100);}
		return true;
		
	}else{
		return false;
	}	
};

var setProjectName = function(destination, project_name) {
	var file = destination + '/package.json';
	var packagejson = JSON.parse(fs.readFileSync(file, 'utf8').toString());
	packagejson.name = project_name;
	packagejson.description = project_name + ' created with Maaperture!';
	fs.writeFile(file, JSON.stringify(packagejson, null, '\t'));
	changeFileRow(	destination + '/config_development.js',
					'title: \'Maaperture\'',
					'title: \'' + project_name + '\','			
				);
	changeFileRow(	destination + '/config_production.js',
					'title: \'Maaperture\'',
					'title: \'' + project_name + '\','			
				);				
};

var initProject = function(project_name, output_path) {
	var source = __dirname + '/../maap_project';
	if(output_path.charAt(output_path.length - 1) != '/'){
		output_path = output_path + '/';
	}
	var destination = output_path + project_name;
	var info = "JK rocks!";
	console.log('');
	console.log(name + " - " + description);
	console.log('');
	console.log('generating the new empty project ' + project_name + ' into ' + destination + '...');
	var options = 
    { 
        clobber: true, 				//avoid2write existing files (false) - true sovrascrive
        filter: function (src) {
            //if(src.indexOf('node_modules') > -1)return false;
			//if(src.indexOf('bower_components') > -1)return false;
			return true;
        }
    };
	
	ncp(source, destination, options, function(err) {
		if(err) {
			return console.error(err);
		}else{
			console.log('setting project\'s name...');
			setProjectName(destination, project_name);
			console.log('');
			console.log('well done!');
			console.log('');
			console.log('you are ready to install the dependencies and start the server');
			console.log('with: "cd ' + destination + ' && npm install && npm start"');
		}
	});	
			
};

program
	.version(version)
	.usage('<command> [options]')
	.option('-N, --name <project_name>', 'specify the project\'s name')
	.option('-O, --output [output_path]', 'specify the output path [./]', './');
 
program
	.command('create')
	.description('create and initialize a new empty project')
	.action(function(){
		if(program.name){
			initProject(program.name, program.output);
		}else{
			printHelpTitle();
			program.help();
		}
	});
	
program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ maaperture create --name razorback -O c:/');
  console.log('    $ maaperture create -N razorback');
  console.log('');
});

program.unknownOption = function(){
	printHelpTitle();
	program.help();
}

program.on('*', function(){
	printHelpTitle();
	program.help();
});

program
	.parse(process.argv);
	
if (process.argv.length < 4) {
	printHelpTitle();
	program.help();
}
