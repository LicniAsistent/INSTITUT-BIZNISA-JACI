import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = 'u4iuvqwd'
export const dataset = 'production'
export const apiVersion = '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Fetch all landing page data
export async function getLandingPageData() {
  const [
    hero,
    features,
    ranks,
    pricing,
    philosophy,
    socialProof,
    testimonials,
    cta
  ] = await Promise.all([
    client.fetch(`*[_type == "hero"][0]`),
    client.fetch(`*[_type == "feature"] | order(order asc)`),
    client.fetch(`*[_type == "rank"] | order(order asc)`),
    client.fetch(`*[_type == "pricing"] | order(order asc)`),
    client.fetch(`*[_type == "philosophy"][0]`),
    client.fetch(`*[_type == "socialProof"][0]`),
    client.fetch(`*[_type == "testimonial"]`),
    client.fetch(`*[_type == "cta"][0]`),
  ])

  return {
    hero,
    features,
    ranks,
    pricing,
    philosophy,
    socialProof,
    testimonials,
    cta
  }
}

// Icon mapping
export const iconMap: Record<string, any> = {
  graduationCap: 'GraduationCap',
  users: 'Users',
  trendingUp: 'TrendingUp',
  award: 'Award',
  messageCircle: 'MessageCircle',
  zap: 'Zap',
  target: 'Target',
  crown: 'Crown',
}
