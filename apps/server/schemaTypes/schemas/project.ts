import {defineType, defineField} from 'sanity'

export const project = defineType({
  name: 'Project',
  title: 'Project',
  type: 'document',
  orderings: [
    {
      title: 'Date, New to Old',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Date, Old to New',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
  groups: [
    {
      name: 'description',
      title: 'Description',
    },
    {
      name: 'content',
      title: 'Content',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'description',
    }),
    defineField({
      name: 'date',
      type: 'date',
      title: 'Date',
      description: 'The date the project was completed or published',
      group: 'description',
      options: {
        dateFormat: 'YYYY-MM',
      },
    }),
    defineField({
      name: 'videoUrl',
      type: 'url',
      title: 'Video URL',
      description: 'Optional video URL for the project',
      group: 'description',
      validation: (rule) => rule.uri({allowRelative: true}).error('Must be a valid URL'),
    }),
    defineField({
      name: 'roles',
      type: 'text',
      rows: 1,
      title: 'Roles',
    }),
    defineField({
      name: 'description',
      type: 'array',
      description: 'A brief description of the project',
      validation: (rule) => rule.required(),
      group: 'description',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
      group: 'description',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      hidden: true,

      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
      group: 'description',
    }),
    defineField({
      name: 'content',
      type: 'array',
      description: 'Add content blocks to your project. You can add text, images, and other media.',
      group: 'content',
      validation: (rule) => rule.required().min(1).error('At least one content block is required'),
      of: [
        {
          type: 'image',
          fields: [
            {name: 'alt', type: 'string', title: 'Alternative Text'},
            {name: 'caption', type: 'string', title: 'Caption'},
            {
              name: 'size',
              type: 'string',
              title: 'Size',
              options: {list: ['small', 'medium', 'large']},
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    }),
  ],
})
