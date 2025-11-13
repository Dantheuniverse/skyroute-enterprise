/**
 * Represents a single piece of work in the portfolio.
 */
export interface WorkPiece {
  /** A unique identifier for the work, used in URLs. */
  slug: string;
  /** The title of the work. */
  title: string;
  /** A short summary of the work. */
  summary: string;
  /** A more detailed description of the work. */
  description: string;
  /** The URL of the video showcasing the work. */
  videoUrl: string;
  /** The URL of the thumbnail image for the work. */
  thumbnail: string;
  /** The duration of the video in MM:SS format. */
  duration: string;
  /** An array of tags associated with the work. */
  tags: string[];
  /** The client for whom the work was created (optional). */
  client?: string;
  /** The date the work was published, in ISO 8601 format. */
  publishedAt: string;
}

/**
 * A collection of all the work pieces in the portfolio.
 */
export const workpieces: WorkPiece[] = [
  {
    slug: 'sky-temple',
    title: 'Sky Temple Immersive Showcase',
    summary: 'A meditative journey above the clouds built with volumetric capture and spatial audio.',
    description:
      'Sky Temple invites viewers to drift through a luminous sanctuary suspended above the clouds. Built with volumetric capture and spatial audio, the experience layers translucent architecture with orchestral ambience to encourage mindful exploration.',
    videoUrl: 'https://cdn.example.com/videos/sky-temple.mp4',
    thumbnail: '/videos/sky-temple-thumb.svg',
    duration: '03:28',
    tags: ['Immersive', 'Volumetric', 'Sound Design'],
    client: 'Temple of Light Collective',
    publishedAt: '2024-01-12T00:00:00.000Z'
  },
  {
    slug: 'lumen-river',
    title: 'Lumen River Projection Story',
    summary: 'Interactive projection mapping that responds to viewer motion across a river installation.',
    description:
      'Commissioned for the Riverside Arts Biennial, Lumen River merges motion capture with responsive projection mapping. The visual story evolves with each passerby, illustrating how data can become a living river of light.',
    videoUrl: 'https://cdn.example.com/videos/lumen-river.mp4',
    thumbnail: '/videos/lumen-river-thumb.svg',
    duration: '02:11',
    tags: ['Projection', 'Installation'],
    client: 'Riverside Arts Biennial',
    publishedAt: '2023-09-20T00:00:00.000Z'
  },
  {
    slug: 'orbit-journal',
    title: 'Orbit Journal Micro Documentary',
    summary: 'A cinematic micro documentary following orbital debris and the people cleaning the night sky.',
    description:
      'Orbit Journal captures the people keeping low earth orbit livable. Shot on-location across launch facilities, it pairs interviews with stylised motion graphics to show how debris removal keeps our constellations safe.',
    videoUrl: 'https://cdn.example.com/videos/orbit-journal.mp4',
    thumbnail: '/videos/orbit-journal-thumb.svg',
    duration: '04:52',
    tags: ['Documentary', 'Motion Graphics'],
    client: 'Skyroute Enterprise',
    publishedAt: '2023-05-03T00:00:00.000Z'
  }
];

/**
 * Retrieves a work piece by its slug.
 * @param slug The slug of the work piece to retrieve.
 * @returns The work piece with the matching slug, or `undefined` if not found.
 */
export const getWorkBySlug = (slug: string) => workpieces.find((work) => work.slug === slug);
