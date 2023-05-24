const fs = require('fs');
const path = require('path');
const minimatch = require('minimatch');
require('dotenv').config();
const input = process.env.INPUT_FOLDER_PATH;
const output = path.join(__dirname, 'output', process.env.OUTPUT_FILE_NAME);
const writeDirectoryContentsToTextFile = (directoryPath, outputFile) => {
    const ignorePatterns = [
        'node_modules',
        'dist',
        '.idea',
        '.vscode',
        '.swp',
        '.DS_Store',
        'logs',
        '.log',
        'pids',
        '.pid',
        '.seed',
        '.pid.lock',
        'typings/',
        '.npm',
        '.node_repl_history',
        'build',
        '.env',
        'package.json',
        'package-lock.json'
    ];

    const stream = fs.createWriteStream(outputFile);

    const shouldIgnore = (filePath) => {
        const basename = path.basename(filePath);
        return ignorePatterns.some(pattern => minimatch(basename, pattern));
    }

    const writeContent = (filePath, indent = "") => {
        const relativePath = path.relative(directoryPath, filePath);
        const stats = fs.statSync(filePath);

        if (shouldIgnore(filePath)) return;

        if (stats.isDirectory()) {
            stream.write(`${indent}${relativePath}\n`);
            const files = fs.readdirSync(filePath);

            for (const file of files) {
                writeContent(path.join(filePath, file), `${indent}\t`);
            }
        } else if (stats.isFile()) {
            stream.write(`${indent}${relativePath}:\n`);
            const content = fs.readFileSync(filePath, 'utf-8');
            stream.write(`${content}\n`);
        }
    }

    writeContent(directoryPath);
    stream.end();
}

writeDirectoryContentsToTextFile(input, output);
