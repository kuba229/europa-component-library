import { queryAll, queryOne } from '@ecl/dom-utils';
import EventManager from '@ecl/event-manager';

/**
 * @param {HTMLElement} element DOM element for component instantiation and scope
 * @param {Object} options
 * @param {String} options.toggleSelector Selector for toggling element
 * @param {String} options.iconSelector Selector for icon element
 * @param {Boolean} options.attachClickListener Whether or not to bind click events on toggle
 */
export class Accordion {
  /**
   * @static
   * Shorthand for instance creation and initialisation.
   *
   * @param {HTMLElement} root DOM element for component instantiation and scope
   *
   * @return {Accordion} An instance of Accordion.
   */
  static autoInit(root, { ACCORDION: defaultOptions = {} } = {}) {
    const accordion = new Accordion(root, defaultOptions);
    accordion.init();
    root.ECLAccordion = accordion;
    return accordion;
  }

  /**
   * An array of supported events for this component.
   *
   * @type {Array<string>}
   * @event Accordion#onToggle
   * @memberof Accordion
   */
  supportedEvents = ['onToggle'];

  constructor(
    element,
    {
      toggleSelector = '[data-ecl-accordion-toggle]',
      iconSelector = '[data-ecl-accordion-icon]',
      attachClickListener = true,
    } = {},
  ) {
    // Check element
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      throw new TypeError(
        'DOM element should be given to initialize this widget.',
      );
    }

    this.element = element;
    this.eventManager = new EventManager();

    // Options
    this.toggleSelector = toggleSelector;
    this.iconSelector = iconSelector;
    this.attachClickListener = attachClickListener;

    // Private variables
    this.toggles = null;
    this.forceClose = false;
    this.target = null;

    // Bind `this` for use in callbacks
    this.handleClickOnToggle = this.handleClickOnToggle.bind(this);
  }

  /**
   * Initialise component.
   */
  init() {
    if (!ECL) {
      throw new TypeError('Called init but ECL is not present');
    }
    ECL.components = ECL.components || new Map();

    this.toggles = queryAll(this.toggleSelector, this.element);

    // Bind click event on toggles
    if (this.attachClickListener && this.toggles) {
      this.toggles.forEach((toggle) => {
        toggle.addEventListener('click', () =>
          this.handleClickOnToggle(toggle),
        );
      });
    }

    // Set ecl initialized attribute
    this.element.setAttribute('data-ecl-auto-initialized', 'true');
    ECL.components.set(this.element, this);
  }

  /**
   * Register a callback function for a specific event.
   *
   * @param {string} eventName - The name of the event to listen for.
   * @param {Function} callback - The callback function to be invoked when the event occurs.
   * @returns {void}
   * @memberof Accordion
   * @instance
   *
   * @example
   * // Registering a callback for the 'click' event
   * accordion.on('onToggle', (event) => {
   *   console.log('Toggle event occurred!', event);
   * });
   */
  on(eventName, callback) {
    this.eventManager.on(eventName, callback);
  }

  /**
   * Trigger a component event.
   *
   * @param {string} eventName - The name of the event to trigger.
   * @param {any} eventData - Data associated with the event.
   *
   * @memberof Accordion
   */
  trigger(eventName, eventData) {
    this.eventManager.trigger(eventName, eventData);
  }

  /**
   * Destroy component.
   */
  destroy() {
    if (this.attachClickListener && this.toggles) {
      this.toggles.forEach((toggle) => {
        toggle.replaceWith(toggle.cloneNode(true));
      });
    }
    if (this.element) {
      this.element.removeAttribute('data-ecl-auto-initialized');
      ECL.components.delete(this.element);
    }
  }

  /**
   * @param {HTMLElement} toggle Target element to toggle.
   *
   * @fires Accordion#onToggle
   */
  handleClickOnToggle(toggle) {
    let isOpening = false;
    // Get target element
    const target = queryOne(
      `#${toggle.getAttribute('aria-controls')}`,
      this.element,
    );

    // Exit if no target found
    if (!target) {
      throw new TypeError(
        'Target has to be provided for accordion (aria-controls)',
      );
    }

    // Get current status
    const isExpanded =
      this.forceClose === true ||
      toggle.getAttribute('aria-expanded') === 'true';

    // Toggle the expandable/collapsible
    toggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');

    if (isExpanded) {
      target.hidden = true;
    } else {
      target.hidden = false;
      isOpening = true;
    }

    const eventData = { item: target, isOpening };
    this.trigger('onToggle', eventData);
  }
}

export default Accordion;
