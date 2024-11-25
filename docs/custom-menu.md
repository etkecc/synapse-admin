# Custom Menu Items

You can add custom menu items to the main menu (sidebar) by providing a `menu` array in the config.
This is useful for adding links to external sites or other pages in your documentation, like a support page or internal wiki.

## Configuration

The examples below contain the configuration settings to add a link to the [Synapse Admin issues](https://github.com/etke.cc/synapse-admin/issues).

Each `menu` item can contain the following fields:

* `label` (required): The text to display in the menu.
* `icon` (optional): The icon to display next to the label, one of the [src/utils/icons.ts](../src/utils/icons.ts) icons, otherwise a
default icon will be used.
* `url` (required): The URL to navigate to when the menu item is clicked.

[Configuration options](config.md)

### config.json

```json
{
  "menu": [
    {
      "label": "Contact support",
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
        "icon": "SupportAgent",
        "url": "https://github.com/etkecc/synapse-admin/issues"
      }
    ]
  }
}
```
