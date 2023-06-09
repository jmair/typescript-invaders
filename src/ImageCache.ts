export default class ImageCache {
  #cache: { [tag: string]: HTMLImageElement } = {};

  public cacheImages = (urls: string[]) => {
    return Promise.all(
      urls.map(async (url) => {
        await this.#loadImage(url);
      })
    );
  };

  #loadImage = (url: string) => {
    const match = url.match(/\w+(?=\.)/g);
    if (match && match[0]) {
      const key: string = match[0];

      // already loaded
      if (key && this.#cache[key]) {
        return;
      }

      // load new image
      const image = new Image();
      return new Promise((resolve, reject) => {
        image.onload = () => {
          this.#cache[key] = image;
          resolve(image);
        };
        image.onerror = (err) => {
          return reject(err);
        };
        image.src = url;
      });
    }
  };

  get = (tag: string) => {
    return this.#cache[tag];
  };
}
