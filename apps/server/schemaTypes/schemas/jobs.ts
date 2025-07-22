import {defineType} from 'sanity'

export default defineType({
  name: 'job',
  title: 'Job',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  preview: {
    select: {
      title: 'title',
      subtitle: 'Date',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title + (subtitle ? ` - ${new Date(subtitle).toLocaleDateString()}` : ''),
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'No date provided',
      }
    },
  },

  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required().error('A description is required'),
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
    },
    {
      name: 'Link',
      title: 'Link',
      type: 'url',
      validation: (Rule) => Rule.uri({allowRelative: true}).error('Must be a valid URL'),
    },
    {
      name: 'Date',
      title: 'Date',
      type: 'date',
      description: 'The date the job was posted or completed',
      options: {
        dateFormat: 'YYYY-MM',
      },
      validation: (Rule) => Rule.required().error('A date is required'),
    },
  ],
})
