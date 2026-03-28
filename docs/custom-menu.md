# 🎯 Custom Menu Items

Extend Ketesa's sidebar navigation with your own links — no rebuild required. Custom menu items appear alongside the built-in navigation and work like any other menu entry.

**Popular uses:**
- Link to your internal runbook or documentation wiki
- Add a shortcut to your monitoring dashboard or status page
- Point to a support ticketing system or help desk
- Add a link to your organization's Matrix community room

Items support translations via the `i18n` field, so multilingual teams see the label in their own language automatically.

## ⚙️ Configuration

The examples below add a link to the [Ketesa issues](https://github.com/etkecc/ketesa/issues).

Each `menu` item can contain the following fields:

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `url` | ✓ | string | The URL to navigate to when the menu item is clicked. |
| `label` | ✓ | string | The text to display in the menu. |
| `i18n` | | object | Dictionary of translations for the label. The keys should be [BCP 47 language tags](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g., `en`, `fr`, `de`) supported by Ketesa (see [src/i18n/](../src/i18n)). |
| `icon` | | string | The icon to display next to the label, one of the [src/utils/icons.ts](../src/utils/icons.ts) icons, otherwise a default icon will be used. |

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
      "url": "https://github.com/etkecc/ketesa/issues"
    }
  ]
}
```

### `/.well-known/matrix/client`

```json
{
  "cc.etke.ketesa": {
    "menu": [
      {
        "label": "Contact support",
        "i18n": {
          "de": "Support kontaktieren",
          "fr": "Contacter le support",
          "zh": "联系支持"
        },
        "icon": "SupportAgent",
        "url": "https://github.com/etkecc/ketesa/issues"
      }
    ]
  }
}
```
