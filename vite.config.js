import { fileURLToPath, URL } from 'url';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import glsl from 'vite-plugin-glsl';
import handlebars from 'vite-plugin-handlebars';
import { handlebarsHelpers } from './src/data/handlebars/helpers.js';

import Prismic from './src/data/prismic/Prismic.js';
import PrismicImages from './src/data/prismic/PrismicImages.js';

import SpriteHelper from './src/data/sprites/helper.js';
// import { DynamicRouterBuilder } from './src/data/router/router.js';

export default async ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };

  // Prismic
  const prismic = new Prismic();
  const results = await prismic.getData();

  // SVG Sprite
  const spriteHelper = new SpriteHelper('src/sprites');
  await spriteHelper.generate();

  // Static Pages
  const input = {
    main: resolve('src/pages/index.html'),
    about: resolve('src/pages/about/index.html'),
  };

  // Dynamic Router
  // new DynamicRouterBuilder(results., '').generate()

  return defineConfig({
    root: 'src/pages',
    build: {
      outDir: '../../dist',
      rollupOptions: {
        input,
      },
    },
    plugins: [
      glsl.default(),

      handlebars({
        context() {
          return {
            ...results,
          };
        },
        helpers: handlebarsHelpers,
        partialDirectory: resolve('src/views'),
      }),

      VitePWA({
        workbox: {
          cleanupOutdatedCaches: false,
        },
      }),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src/app', import.meta.url)),
      },
    },
  });
};
