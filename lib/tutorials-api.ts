import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const tutorialsDirectory = join(process.cwd(), '_tutorials')

export function getTutorialsSlugs() {
  return fs.readdirSync(tutorialsDirectory)
}

export function getTutorialsBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(tutorialsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllTutorials(fields: string[] = []) {
  const slugs = getTutorialsSlugs()
  const tutorials = slugs.map((slug) => getTutorialsBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return tutorials
}