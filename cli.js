#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const faker = require('faker')
const { Command, flags } = require('@oclif/command')

class FireMonkey extends Command {
  async run() {
    const { directory, extensions, additions, modifications, deletions, createdFiles, deletedFiles, renamedFiles } = this.parse(FireMonkey).flags

    const directoryLocation = path.resolve(directory)
    const files = fs.readdirSync(directoryLocation)

    if (createdFiles > additions) {
      console.error('createdFiles > additions')

      process.exit(1)
    }

    for (let i = 0; i < createdFiles; i++) {
      const extension = pickRandom(extensions)
      const fileName = `${uuid.v4()}.${extension}`

      fs.writeFileSync(path.join(directoryLocation, fileName), createLine(), 'utf8')
    }
  }
}

FireMonkey.flags = {
  version: flags.version(),
  help: flags.help(),
  directory: flags.string({
    char: 'x',
    description: 'Where to create the files',
    default: process.cwd(),
  }),
  extensions: flags.string({
    char: 'e',
    description: 'File extensions to create',
    multiple: true,
    default: ['txt'],
  }),
  additions: flags.integer({
    char: 'a',
    description: 'Number of additions to create',
    default: 1,
  }),
  modifications: flags.integer({
    char: 'm',
    description: 'Number of modifications to create',
    default: 0,
  }),
  deletions: flags.integer({
    char: 'd',
    description: 'Number of deletions to create',
    default: 0,
  }),
  createdFiles: flags.integer({
    char: 'c',
    description: 'Number of files to create',
    default: 1,
  }),
  deletedFiles: flags.integer({
    char: 's',
    description: 'Number of files to delete',
    default: 0,
  }),
  renamedFiles: flags.integer({
    char: 'r',
    description: 'Number of files to rename',
    default: 0,
  }),
}

FireMonkey.run()
.catch(require('@oclif/errors/handle'))

function randomInteger(min, max) {
  return
}
function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function createLine() {
  return faker.random.words()
}
