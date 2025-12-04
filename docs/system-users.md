# System / Appservice-managed Users

Inadvertently altering system user accounts managed by appservices (such as bridges) / system (such as bots) is a common issue.
Editing, deleting, locking, or changing the passwords of these appservice-managed accounts can cause serious problems.
To prevent this, we've added a new feature that blocks these types of modifications to such accounts,
while still allowing other risk-free changes (changing display names and avatars).
By defining a list of MXID regex patterns in the new `asManagedUsers` configuration setting,
you can protect these accounts from accidental changes.

If a system-managed user was locked, deactivated, or erased by mistake (e.g., from a client app or using any other way),
 Synapse Admin will allow to restore it back to an active state.

## Configuration

The examples below contain the configuration settings to mark
[Telegram bridge (mautrix-telegram)](https://github.com/mautrix/telegram),
[Slack bridge (mautrix-slack)](https://github.com/mautrix/slack),
and [Baibot](https://github.com/etkecc/baibot) users of `example.com` homeserver as appservice-managed users,
just to illustrate the options to protect both specific MXIDs (as in the Baibot example) and all puppets of a bridge (as in the Telegram and Slack examples).

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
"cc.etke.synapse-admin": {
  "asManagedUsers": [
    "^@baibot:example\\.com$",
    "^@slackbot:example\\.com$",
    "^@slack_[a-zA-Z0-9\\-]+:example\\.com$",
    "^@telegrambot:example\\.com$",
    "^@telegram_[a-zA-Z0-9]+:example\\.com$"
  ]
}
```
