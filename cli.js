#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const faker = require('faker')
const { Command, flags } = require('@oclif/command')

class FireMonkey extends Command {
  async run() {
    const { directory, extensions, createdFiles, deletedFiles, renamedFiles } = this.parse(FireMonkey).flags

    const directoryLocation = path.resolve(directory)
    const files = fs.readdirSync(directoryLocation)

    console.log(`🐒 About to create ${createdFiles} files, delete ${deletedFiles} files and rename ${renamedFiles} files in ${directoryLocation} with extension${extensions.length > 1 ? 's' : ''} ${extensions}.`)

    for (let i = 0; i < deletedFiles; i++) {
      const fileName = popRandom(files)

      if (!fileName) break

      fs.unlinkSync(path.join(directoryLocation, fileName))
    }

    for (let i = 0; i < renamedFiles; i++) {
      const fileName = popRandom(files)

      if (!fileName) break

      const nextFileName = createFileName(pickRandom(extensions))

      files.push(nextFileName)

      fs.renameSync(path.join(directoryLocation, fileName), path.join(directoryLocation, nextFileName))
    }

    for (let i = 0; i < createdFiles; i++) {
      const fileName = createFileName(pickRandom(extensions))

      files.push(fileName)

      fs.writeFileSync(path.join(directoryLocation, fileName), '', 'utf-8')
    }

    files.forEach(file => {
      const filePath = path.join(directoryLocation, file)
      const contentArray = fs.readFileSync(filePath, 'utf-8').split('\n')

      const nDeletions = randomInteger(1, contentArray.length - 1)
      const nAddition = randomInteger(1, 500)

      for (let i = 0; i < nDeletions; i++) {
        contentArray.splice(randomInteger(0, contentArray.length - 1), 1)
      }

      for (let i = 0; i < nAddition; i++) {
        contentArray.splice(randomInteger(0, contentArray.length - 1), 0, createLine())
      }

      fs.writeFileSync(filePath, contentArray.join('\n'), 'utf-8')
    })

    console.log('🐒 Done!')
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
  createdFiles: flags.integer({
    char: 'c',
    description: 'Number of files to create',
    default: 1,
  }),
  deletedFiles: flags.integer({
    char: 'd',
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
  return Math.floor(Math.random() * (max - min) + min)
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function popRandom(array) {
  return array.splice(Math.random() * array.length, 1)[0]
}

function createLine() {
  return faker.random.words(randomInteger(6, 36))
}

function createFileName(extension) {
  return `${uuid.v4()}.${extension}`
}
