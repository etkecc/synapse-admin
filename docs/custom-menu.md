# Custom Menu Items

You can add custom menu items to the main menu (sidebar) by providing a `menu` array in the config.
This is useful for adding links to external sites or other pages in your documentation, like a support page or internal wiki.

## Configuration

The examples below contain the configuration settings to add a link to the [Synapse Admin issues](https://github.com/etke.cc/synapse-admin/issues).

Each `menu` item can contain the following fields:

* `url` (required): The URL to navigate to when the menu item is clicked.
* `label` (required): The text to display in the menu.
* `i18n` (optional): Dictionary of translations for the label. The keys should be [BCP 47 language tags](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g., `en`, `fr`, `de`) supported by Synapse Admin (see [src/i18n/](../src/i18n)).
* `icon` (optional): The icon to display next to the label, one of the [src/utils/icons.ts](../src/utils/icons.ts) icons, otherwise a
default icon will be used.

[Configuration options](config.md)

### config.json

```json
{
  "menu": [
    {
      "label": "Contact support",
      "i18n": {
        "de": "Support kontaktieren",
        "fr": "Contacter le support",
        "zh": "联系支持"
      },
      "icon": "SupportAgent",
      "url": "https://github.com/etkecc/synapse-admin/issues"
    }
  ]
}
```

### `/.well-known/matrix/client`

```json
{
  "cc.etke.synapse-admin": {
    "menu": [
      {
        "label": "Contact support",
        "i18n": {
          "de": "Support kontaktieren",
          "fr": "Contacter le support",
          "zh": "联系支持"
        },
        "icon": "SupportAgent",
        "url": "https://github.com/etkecc/synapse-admin/issues"
      }
    ]
  }
}
```
