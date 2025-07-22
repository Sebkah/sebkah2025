import {defineConfig} from 'sanity'
import {StructureResolver, structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

const singletonTypes = new Set(['CV'])

const structure: StructureResolver = (S, context) => {
  return S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('Project').title('Projects'),
      S.listItem()
        .title('CV')
        .schemaType('cv')
        .child(S.document().schemaType('cv').documentId('cv').title('CV')),
    ])
}
export default defineConfig({
  name: 'default',
  title: 'sebkah2025',

  projectId: '4dodm90m',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
