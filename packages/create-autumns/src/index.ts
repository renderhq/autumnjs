#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { readFileSync, readdirSync, writeFileSync as fsWriteFileSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import prompts from 'prompts'
import * as kolorist from 'kolorist'
import minimist from 'minimist'

const { blue, green, red, yellow } = kolorist

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const TEMPLATES = [
  {
    name: 'default',
    display: 'Default',
    description: 'A basic Autumn.js application with TypeScript and JSX'
  },
  {
    name: 'tailwind',
    display: 'Tailwind CSS',
    description: 'Default template + Tailwind CSS for styling'
  }
]

async function init() {
  const args = minimist(process.argv.slice(2))

  console.log(blue('✨ Create Autumn.js App'))
  console.log('')

  const targetDir = args._[0] || 'autumn-app'
  const skipPrompts = args.yes || args.default

  let template = args.template || 'default'
  let packageName = args.name || targetDir
  let description = args.description || 'An Autumn.js application'
  let author = args.author || ''

  if (!skipPrompts) {
    const { template: selectedTemplate } = await prompts({
      type: 'select',
      name: 'template',
      message: 'Please select a template:',
      choices: TEMPLATES.map(t => ({
        title: `${t.display} - ${t.description}`,
        value: t.name
      }))
    })

    if (!selectedTemplate) {
      process.exit(1)
    }
    template = selectedTemplate

    const { packageName: selectedPackageName } = await prompts({
      type: 'text',
      name: 'packageName',
      message: 'Package name:',
      initial: packageName,
      validate: (name: string) => name ? true : 'Package name is required'
    })
    packageName = selectedPackageName

    const { description: selectedDescription } = await prompts({
      type: 'text',
      name: 'description',
      message: 'Description:',
      initial: description
    })
    description = selectedDescription

    const { author: selectedAuthor } = await prompts({
      type: 'text',
      name: 'author',
      message: 'Author:',
      initial: author
    })
    author = selectedAuthor
  }

  console.log('')
  console.log(yellow('Creating project...'))

  try {
    // Create target directory
    mkdirSync(targetDir, { recursive: true })

    // Copy template files
    const templateDir = resolve(__dirname, '../template', template)
    copyTemplateFiles(templateDir, targetDir)

    // Update package.json with user input
    const packageJsonPath = resolve(targetDir, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    packageJson.name = packageName
    packageJson.description = description
    if (author) packageJson.author = author

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    console.log(green('✅ Project created successfully!'))
    console.log('')
    console.log(kolorist.bold('Next steps:'))
    console.log(`  cd ${kolorist.cyan(targetDir)}`)
    console.log(`  ${kolorist.cyan('pnpm install')}`)
    console.log(`  ${kolorist.cyan('pnpm dev')}`)
    console.log('')

  } catch (error) {
    console.error(red('Error creating project:'), error instanceof Error ? error.message : 'Unknown error')
    process.exit(1)
  }
}

function copyTemplateFiles(src: string, dest: string) {
  const files = readdirSync(src, { withFileTypes: true })

  for (const file of files) {
    const srcPath = resolve(src, file.name)
    // Rename _gitignore to .gitignore
    const targetFileName = file.name === '_gitignore' ? '.gitignore' : file.name
    const destPath = resolve(dest, targetFileName)

    if (file.isDirectory()) {
      mkdirSync(destPath, { recursive: true })
      copyTemplateFiles(srcPath, destPath)
    } else {
      const content = readFileSync(srcPath, 'utf-8')
      writeFileSync(destPath, content)
    }
  }
}

function writeFileSync(path: string, content: string) {
  fsWriteFileSync(path, content)
}

init().catch(console.error)