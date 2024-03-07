#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import downloadGitRepo from 'download-git-repo';
import { globby } from 'globby';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';

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
	if (fs.existsSync(dirName)) {
		console.log(chalk.red(dirName + ' exists'));
		return;
	}
	const spinner = ora('下载模版');
	spinner.start();

	const tempDir = Date.now() + 'tmp_demo_dir';
	downloadGitRepo('rodson/create-demo-app', tempDir, function (err, data) {
		if (err === 'Error') {
			spinner.fail('Request failed, refetch ...')
		} else {
			spinner.succeed();
			fs.copySync(path.resolve(process.cwd(), tempDir, 'template'), path.resolve(process.cwd(), dirName));
			fs.removeSync(path.resolve(process.cwd(), tempDir), { recursive: true });
			console.log(chalk.greenBright('更新package.json'));
			const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), dirName, 'package.json'), 'utf8'));
			packageJson.name = dirName;
			fs.writeFileSync(path.resolve(process.cwd(), dirName, 'package.json'), JSON.stringify(packageJson, null, 2));
		}
	  })
	  return;
})

program.parse();
