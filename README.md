Maaperture
-------------
MongoDB as an Admin Platform

Copyright (c) 2014, Aperture Software

All rights reserved.

Install from npm:

	npm install -g maaperture
	
Usage: 
	
	maaperture <command> [options]

Commands:

	create                 		create and initialize a new empty project

Options:

	-h, --help                  output usage information
	-V, --version               output the version number
	-N, --name <project_name>   specify the project's name
	-O, --output [output_path]  specify the output path [./]

Examples:

	$ maaperture create --name razorback -O c:/
	$ maaperture create -N razorback
	
Maaperture on heroku
-------------
Try out a Maaperture example app on heroku:
Heromaap -> http://heromaap.herokuapp.com
	
Maaperture collection example dsl [workers.maap]
-------------

```  javascript
collection = {
	label: 'Fulltime workers', 	//collection label
	name: 'workers',						//mongoDB collection's name
	position: 3, 							//menu position
	
	index : {
		populate: [{collection: 'jobs', key: 'job'}],
		perpage: 20,
		sortby: 'age',
		order: 'asc',
		column : [
			{	
				label: 'Name',
				name: 'name',
				type: 'String'
			},
			{	
				label: 'Field',
				name: 'job.type',
				type: 'String',
				transformation: 'type = type + \" fulltime\";'
			},
			{	
				label: 'Registration date',
				name: 'registration_date',
				type: 'Date, default: Date.now'
			},
			{	
				label: 'Turn',
				name: 'jobtype',
				type: 'String'
			},
			{	
				label: 'Age,
				name: 'age',
				type: 'Number, min: 0, max:199'
			}
		],
		query: {
			age: {$lt: 28},
			jobtype: 'fulltime'
		}
	}, //end index page
	
	show : {
		populate: [{collection: 'jobs', key: 'job'}, {collection: 'sports', key: 'sport'}],
		row : [
			{
				label: 'ID',
				name: '_id',
				type: 'ObjectId'
			},
			{	
				label: 'Name',
				name: 'name',
				type: 'String'
			},
			{	
				label: 'Field',
				name: 'job.type',
				type: 'String'
			},
			{	
				label: 'Registration Date',
				name: 'registration_date',
				type: 'Date, default: Date.now'
			},
			{	
				name: 'age',
				type: 'Number, min: 0, max:199'
			},
			{	
				label: 'Sport',
				name: 'sport.name',
				type: 'String'
			},
			{
				label: 'Hobbies',
				name: 'interest',
				type: '[String]',
				transformation: 'var result = \"\" ; \
								for(var i=0; i<interest.length; i++) \
								{ \
									if(i != 0){result += \", \"; } \
									result += interest[i]; \
								} \
								interest = result;'
			}
			
		]
	} //end show page
	
} //end collection	

//exports collection [DO NOT REMOVE]
exports.collection = collection;
```
