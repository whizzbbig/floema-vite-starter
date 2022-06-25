import fetch from 'node-fetch';
import fs from 'fs';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import sharp from 'sharp';

const DIRECTORY_ORIGINAL = 'src/pages/public/original';
const DIRECTORY_IMAGES = 'src/pages/public/images';

export default class {
  constructor(results) {
    this.images = [];
    this.results = results;
  }

  generate() {
    return new Promise(async resolve => {
      this.findImages(this.results);
      await this.generateImages();
      await this.resizeImages();
      this.compressImages();

      resolve();
    });
  }

  findImages(object) {
    Object.keys(object).forEach(key => {
      const value = object[key];

      if (key === 'url' && value?.includes('//images.prismic.io')) {
        this.images.push(value);
      }

      const isObject = typeof value === 'object';
      const isArray = Array.isArray(value);

      if (isArray && value.length) {
        value.forEach(value => {
          this.findImages(value);
        });
      }

      if (isObject && value) {
        this.findImages(value);
      }
    });
  }

  generateImages() {
    fs.mkdirSync(`${DIRECTORY_ORIGINAL}`, {
      recursive: true,
    });

    const images = this.images.filter((v, i, a) => a.indexOf(v) === i);

    const promises = images.map(async image => {
      const url = image.replace('?auto=compress,format', '');
      const file = url
        .replace('https://images.prismic.io/floema-ice/', '')
        .replace(/\+/g, '-');
      const path = `${DIRECTORY_ORIGINAL}/${file}`;

      if (fs.existsSync(path)) {
        console.log(`${path} downloaded already.`);
      } else {
        const response = await fetch(url);
        const buffer = await response.buffer();

        fs.writeFile(path, buffer, event => {
          console.log(`${path} downloaded.`);
        });
      }

      return Promise.resolve();
    });

    return Promise.all(promises);
  }

  async resizeImages() {
    fs.mkdirSync(`${DIRECTORY_IMAGES}`, {
      recursive: true,
    });

    const files = fs.readdirSync(`${DIRECTORY_ORIGINAL}`, {
      withFileTypes: true,
    });

    for (const file of files) {
      await sharp(`${DIRECTORY_ORIGINAL}/${file.name}`)
        .resize(1920, null, { withoutEnlargement: true })
        .toFile(`${DIRECTORY_IMAGES}/${file.name}`);
    }
  }

  async compressImages() {
    const files = await imagemin([`${DIRECTORY_IMAGES}/*.{jpg,png}`], {
      destination: `${DIRECTORY_IMAGES}`,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.8, 0.9],
        }),
      ],
    });
  }
}
