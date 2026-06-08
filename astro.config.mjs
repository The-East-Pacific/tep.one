import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tep.one',
  integrations: [
    starlight({
      title: 'Tep Worlds',
      description: 'A community of worldbuilders, diplomats, and storytellers. Home to The East Pacific, Urth, and Valsora.',
      logo: {
        src: './src/assets/logo.png',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',
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
