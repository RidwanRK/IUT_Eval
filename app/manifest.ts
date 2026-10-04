import type { MetadataRoute } from 'next';
import { copy } from '@/config/copy';
import { institution } from '@/config/institution';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: institution.appName,
    short_name: institution.shortName,
    description: copy.app.description,
    start_url: '/student',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#C8102E',
    lang: 'en',
    categories: ['education'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
