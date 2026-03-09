# User Badges

To help with identifying users with certain roles or permissions, we have implemented a badge system.
These badges are displayed on the user's avatar and have a handy tooltip that explains what the badge means.

## Available Badges

### 🧙‍ You

This badge is displayed on your user's avatar.
The tooltip for this badge contains additional information, e.g.: `You (Admin)`.

### 👑 Admin

This badge is displayed on homeserver admins' avatars.
Tooltip for this badge is `Admin`.

### 🛡️ Appservice/System-managed

This badge is displayed on users that are managed by an appservice (or system), [more details](./system-users.md).
The tooltip for this badge contains additional information, e.g.: `System-managed (Bot)`.

### 🤖 Bot

This badge is displayed on bots' avatars (users with the `user_type` set to `bot`).
Tooltip for this badge is `Bot`.

### 📞 Support

This badge is displayed on users that are part of the support team (users with the `user_type` set to `support`).
Tooltip for this badge is `Support`.

### 👤 Regular User

This badge is displayed on regular users' avatars.
Tooltip for this badge is `Regular User`.

### 🌐 Federated (Remote) User

This badge is displayed on federated (remote) users' avatars.
Tooltip for this badge is `Federated User`.
