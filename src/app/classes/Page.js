import Component from './Component';

export default class Page extends Component {
  constructor({ classes, element, elements }) {
    super({
      autoMount: false,
      classes,
      element,
      elements: {
        ...elements,
        images: 'img',
      },
    });
  }

  create() {
    super.create();

    this.components = [];
  }

  /**
   * Animations.
   */
  beforeShow() {
    if (this.elements.images) {
      if (!this.elements.images.length) {
        this.elements.images = [this.elements.images];
      }

      this.elements.images.forEach(image => {
        image.setAttribute('src', image.getAttribute('data-src'));
      });
    }
  }

  show(animation) {
    this.beforeShow();

    return new Promise(async resolve => {
      if (animation) {
        await animation.play();
      } else {
        console.warn(`Page doesn't have animation in set.`);
      }

      this.afterShow();

      resolve();
    });
  }

  afterShow() {}

  beforeHide() {}

  hide(animation) {
    this.beforeHide();

    return new Promise(async resolve => {
      if (animation) {
        await animation.play();
      } else {
        console.warn(`Page doesn't have animation out set.`);
      }

      this.afterHide();

      resolve();
    });
  }

  afterHide() {}

  /**
   * Events.
   */
  onMouseDown(event) {
    this.components.forEach(component => component.onMouseDown?.(event));
  }

  onMouseMove(event) {
    this.components.forEach(component => component.onMouseMove?.(event));
  }

  onMouseUp(event) {
    this.components.forEach(component => component.onMouseUp?.(event));
  }

  onResize(event) {
    this.components.forEach(component => component.onResize?.(event));
  }

  /**
   * Loop.
   */
  update() {
    this.components.forEach(component => component.update?.());
  }
}
