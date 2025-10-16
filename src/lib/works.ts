// Demo dataset representing the work showcased on the portfolio.
export interface WorkPiece {
  slug: string;
  title: string;
  summary: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  tags: string[];
  client?: string;
  publishedAt: string;
}

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

export const getWorkBySlug = (slug: string) => workpieces.find((work) => work.slug === slug);
