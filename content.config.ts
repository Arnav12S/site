import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string()
      })
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.array(z.object({
          name: z.string(),
          picture: z.string()
        })),
        date: z.string(),
        tags: z.array(z.string()),
        rawbody: z.string(),
        toc: z.object({
          items: z.array(z.object({
            id: z.string(),
            title: z.string(),
            level: z.number(),
            depth: z.number()
          }))
        }).optional(),
      })
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()).optional(),
        rawbody: z.string(),
        url: z.string().optional()
      })
    }),
    author: defineCollection({
      type: 'data',
      source: 'author/*.yml',
      schema: z.object({
        name: z.string(),
        picture: z.string()
      }),
    }),
    roles: defineCollection({
      type: 'data',
      source: 'roles/*.json',
      schema: z.object({
        name: z.string(),
        description: z.string(),
        company: z.array(z.object({
          name: z.string(),
          description: z.string(),
          logo: z.string(),
          url: z.string()
        })).optional(),
        start: z.string(),
        end: z.string().optional(),
        location: z.string().optional(),
        tags: z.array(z.string()).optional(),
        rawbody: z.string(),
        type: z.enum(['work', 'education', 'volunteering', 'other']).optional(),
        skills: z.array(z.string()).optional(),
        projects: z.array(z.string()).optional(),
        achievements: z.array(z.string()).optional(),
        references: z.array(z.string()).optional()
      })
    }),
    education: defineCollection({
      type: 'data',
      source: 'education/*.json',
      schema: z.object({
        name: z.string(),
        university: z.object({
          name: z.string(),
          logo: z.string()
        }).optional(),
        description: z.string(),
        start: z.string(),
        end: z.string().optional(),
        location: z.string().optional(),
        tags: z.array(z.string()).optional(),
        rawbody: z.string(),
        skills: z.array(z.string()).optional(),
        projects: z.array(z.string()).optional(),
        achievements: z.array(z.string()).optional(),
        references: z.array(z.string()).optional()
      })
    }),
    skills: defineCollection({
      type: 'data',
      source: 'skills/*.json',
      schema: z.object({
        name: z.string(),
        description: z.string(),
        level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
        tags: z.array(z.string()).optional(),
        rawbody: z.string(),
        icon: z.string().optional(),
        color: z.string().optional()
      })
    }),
    home: defineCollection({
      type: 'page',
      source: '**/*.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        hero: z.object({
          title: z.string(),
          description: z.string(),
          content: z.string(),
          Ogtitle: z.string().optional(),
          Ogdescription: z.string().optional()
        }),
        sections: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({
            title: z.string(),
            description: z.string(),
            to: z.string()
          }))
        }))
      })
    })
  }
})
