# 🤖 System / Appservice-managed Users

Matrix bridges work by creating "puppet" accounts for every bridged user — a Telegram bridge, for example, will have one Matrix account for every Telegram contact that participates in bridged rooms. These accounts are entirely managed by the bridge appservice. Accidentally editing, deactivating, locking, or resetting the password of a puppet account will break the bridge for that user, often silently.

Ketesa lets you define a list of MXID patterns to mark as appservice-managed. Once marked, these accounts are **protected from destructive changes** while still allowing harmless cosmetic edits (display name and avatar).

**Protected operations** (blocked for system-managed users):
- Deactivating or erasing the account
- Locking / shadow-banning
- Resetting the password
- Changing admin status

**Always allowed** (safe for bridges):
- Updating display name
- Updating avatar

> 💡 **Recovery:** If a system-managed user was locked, deactivated, or erased by mistake (e.g., from a client app or using any other way), Ketesa will still allow you to restore it to an active state.

## 🔍 Filtering

When `asManagedUsers` is configured, a **System users** filter appears in the users list. It allows you to:

- **Exclude system** — hide system/appservice-managed users from the list
- **Only system** — show only system/appservice-managed users

The filtering is performed client-side with cached regex results for optimal performance.

## ⚙️ Configuration

The examples below contain the configuration settings to mark [Telegram bridge (mautrix-telegram)](https://github.com/mautrix/telegram), [Slack bridge (mautrix-slack)](https://github.com/mautrix/slack), and [Baibot](https://github.com/etkecc/baibot) users of `example.com` homeserver as appservice-managed users. This illustrates the options to protect both specific MXIDs (as in the Baibot example) and all puppets of a bridge (as in the Telegram and Slack examples).

[Configuration options](config.md)

### config.json

```json
"asManagedUsers": [
  "^@baibot:example\\.com$",
  "^@slackbot:example\\.com$",
  "^@slack_[a-zA-Z0-9\\-]+:example\\.com$",
  "^@telegrambot:example\\.com$",
  "^@telegram_[a-zA-Z0-9]+:example\\.com$"
]
```

### `/.well-known/matrix/client`

```json
"cc.etke.ketesa": {
  "asManagedUsers": [
    "^@baibot:example\\.com$",
    "^@slackbot:example\\.com$",
    "^@slack_[a-zA-Z0-9\\-]+:example\\.com$",
    "^@telegrambot:example\\.com$",
    "^@telegram_[a-zA-Z0-9]+:example\\.com$"
  ]
}
```
