import { LitElement, html, customElement, property, CSSResult, TemplateResult, css, PropertyValues } from 'lit-element';
import { HomeAssistant, LovelaceCardEditor, createThing } from 'custom-card-helpers';
import { hass } from 'card-tools/src/hass';
import { string as toStyle } from 'to-style';

import { FrameCardConfig } from './types';
import { CARD_VERSION } from './const';

import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(`FRAME-CARD ${localize('common.version')} ${CARD_VERSION} loaded...`);

@customElement('frame-card')
export class FrameCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('frame-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): object {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  @property() public hass?: HomeAssistant;
  @property() private _config?: FrameCardConfig;
  @property() private card?;

  public setConfig(config: FrameCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    this._config = {
      ...config,
    };
  }

  /***
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps, false);
  }
  ***/

  updated(changedProps) {
    if (!this.card) {
      this.card = this.build_card();
    }

    if (this.card && changedProps && changedProps.has('hass')) {
      this.card.hass = this.hass;
    }
  }

  build_card() {
    if (this._config && this._config.card) {
      const el = createThing(this._config.card);
      el.hass = this.hass;
      return el;
    }

    return null;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    return html`
      <div class="framecard" .header=${this._config.name}>
        <fieldset style=${toStyle(this._config.style)}>
          <legend style="${toStyle(this._config.title_style)}" align="${this._config.title_align || ''}">
            ${this._config.title}
          </legend>
          ${this.card}
        </fieldset>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .framecard {
        margin: 5px;
      }
    `;
  }
}
