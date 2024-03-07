#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import { globby } from 'globby';
import path from 'path';
import fs from 'fs-extra';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

console.log(import.meta.url);
console.log(__filename);

const program = new Command();

program
.version('1.1.0')
.command('create <name>')
.description('create a new project')
.action(async dirName => { 
	console.log('--- name ---');
	console.log(dirName);
	const answers = await inquirer
		.prompt([
			{
				name: 'compiler',
				message: '选择需要的框架',
				"type": "checkbox",
				"choices": [ // 具体的选项
					{
						"name": "Babel",
						"value": "babel",
						"description": "Transpile modern JavaScript to older versions (for compatibility)",
						"link": "https://babeljs.io/",
					},
					{
						"name": "Router",
						"value": "router",
						"description": "Structure the app with dynamic pages",
						"link": "https://router.vuejs.org/"
					},
				]
			},
			{
				name: 'vue',
				when: answers => answers.compiler.includes('babel'),
			},
		]);

		console.log('---- answer ----');
		console.log(answers);

		const _files = await globby([path.join(path.dirname(__filename), 'template')], { dot: true })
		let templateFiles = [];
		_files.forEach(curPath => {
			templateFiles.push({name: path.basename(curPath), content: fs.readFileSync(curPath, 'utf-8')});
		});

		templateFiles.forEach((item) => {
			console.log(process.cwd());
			const filePath = path.join(process.cwd(), dirName, item.name)
			fs.ensureDirSync(path.dirname(filePath))
			fs.writeFileSync(filePath, item.content)
		})
		console.log(_files);
})

program.parse();
