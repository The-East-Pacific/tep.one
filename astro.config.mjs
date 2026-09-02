import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tep.one',
  integrations: [
    starlight({
      title: 'TEP',
      description: 'Urth, Valsora and The East Pacific — modern worldbuilding, fantasy roleplay and community. What story will you craft?',
      logo: {
        src: './src/assets/logo.png',
        replacesTitle: false,
      },
      favicon: '/favicon.ico',
      customCss: ['./src/styles/custom.css'],
      components: {
        Footer: './src/components/Footer.astro',
      },
         social: {
        discord: 'https://discord.com/channels/633351482128728064',
      },

      editLink: {
        baseUrl: 'https://github.com/the-east-pacific/tepone/edit/main/',
      },
      sidebar: [
        {
          label: 'Our Worlds',
          items: [
            { label: 'The East Pacific', slug: 'worlds/tep/overview' },
            { label: 'Urth', slug: 'worlds/urth/overview' },
            { label: 'Valsora', slug: 'worlds/valsora/overview' },
          ],
        },
        {
          label: 'Community',
          items: [
            { label: 'Forum', slug: 'community/forum' },
            { label: 'Discord', slug: 'community/discord' },
            { label: 'Shortlinks', slug: 'community/shortlinks' },
          ],
        },
      ],
    }),
    mdx(),
    sitemap(),
  ],
});
