import * as prismic from '@prismicio/client';

import fetch from 'node-fetch';

export default class PrismicHook {
  async getData() {
    const { VITE_PRISMIC_REPOSITORY, VITE_PRISMIC_ACCESS_TOKEN } = process.env;

    const accessToken = VITE_PRISMIC_ACCESS_TOKEN;
    const endpoint = prismic.getEndpoint(VITE_PRISMIC_REPOSITORY);
    const client = prismic.createClient(endpoint, {
      accessToken,
      fetch,
    });

    const about = await client.getSingle('about');
    const home = await client.getSingle('home');
    const preloader = await client.getSingle('preloader');
    const meta = await client.getSingle('meta');
    const navigation = await client.getSingle('navigation');
    const collections = await client.getAllByType('collection');
    const products = await client.getAllByType('product');
    const collectionsList = await client.getSingle('collections');

    console.log(about.data.gallery);

    return {
      about,
      home,
      meta,
      navigation,
      products,
      preloader,
      collections,
    };
  }
}
