# firemonkey

A chaos generator for repositories

## Installation

`npm install -D firemonkey` or `npx firemonkey`

## Usage

In `./chaos` directory, to generate 100 chaotic files, delete 30 files and rename 10 files type:

`firemonkey --directory ./chaos --extensions cpp h --createdFiles 100 --deletedFiles 30 --renamedFiles 10`

For more information on the command type:

`firemonkey --help`

## License

MIT
