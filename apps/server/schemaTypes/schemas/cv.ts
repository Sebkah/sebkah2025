import {defineType} from 'sanity'

export default defineType({
  name: 'cv',
  title: 'CV',
  type: 'document',
  fields: [{name: 'jobs', type: 'array', of: [{type: 'job'}]}],
})



