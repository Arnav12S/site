import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event) // Assuming you're using a query parameter for search
  if (!q) {
    return []
  }

  const results = await queryCollection('/projects')
    .where({
      _type: 'page', // Adjust based on your collection types
      navigation: { $ne: false },
      draft: { $ne: true },
      $or: [
        { title: { $contains: q as string } },
        { description: { $contains: q as string } },
        // Add more fields as needed
      ]
    })
    .only([
      'title',
      'description',
      'path',
      '_type',
      'navigation',
      'badge',
      'date'
    ])
    .sort({ date: -1, title: 1 })
    .find()

  return results
})
