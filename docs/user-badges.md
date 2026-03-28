# 🏷️ User Badges

Ketesa displays role badges on user avatars throughout the interface — in the users list, the user detail view, and anywhere an avatar appears. Each badge has a tooltip explaining what it means, and multiple badges can appear on a single avatar when a user has more than one role (e.g., a bot that is also system-managed).

This makes it easy to identify account types at a glance without opening individual user records — especially useful when managing large servers with many bridge puppets, bots, and federated users.

| Badge | Who it appears on |
|-------|------------------|
| 🧙 **You** | Your own account |
| 👑 **Admin** | Homeserver administrators |
| 🛡️ **Appservice/System-managed** | Bridge puppets and other [appservice-managed accounts](./system-users.md) |
| 🤖 **Bot** | Accounts with `user_type: bot` |
| 📞 **Support** | Accounts with `user_type: support` |
| 👤 **Regular User** | Standard local accounts |
| 🌐 **Federated** | Remote users from other homeservers |

## 📌 Available Badges

### 🧙 You

This badge is displayed on your user's avatar. The tooltip for this badge contains additional information, e.g.: `You (Admin)`.

### 👑 Admin

This badge is displayed on homeserver admins' avatars. Tooltip: `Admin`.

### 🛡️ Appservice/System-managed

This badge is displayed on users that are managed by an appservice (or system). [Learn more about system users](./system-users.md). The tooltip for this badge contains additional information, e.g.: `System-managed (Bot)`.

### 🤖 Bot

This badge is displayed on bots' avatars (users with the `user_type` set to `bot`). Tooltip: `Bot`.

### 📞 Support

This badge is displayed on users that are part of the support team (users with the `user_type` set to `support`). Tooltip: `Support`.

### 👤 Regular User

This badge is displayed on regular users' avatars. Tooltip: `Regular User`.

### 🌐 Federated (Remote) User

This badge is displayed on federated (remote) users' avatars. Tooltip: `Federated User`.
