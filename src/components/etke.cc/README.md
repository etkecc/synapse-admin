# etke.cc-specific components

This directory contains [etke.cc](https://etke.cc)-specific components, unusable for any other purposes and/or configuration.

We at [etke.cc](https://etke.cc) attempting to develop everything open-source, but some components are too specific to
be used by anyone else. This directory contains such components.

Due to the specific mentioned above, these components are neither documented in the [docs](../../../docs/README.md), nor supported as
part of the Synapse Admin open-source project.

## Components

### Server Status icon

![Server Status icon](../../../screenshots/etke.cc/server-status/indicator.webp)

In the application bar the new monitoring icon is displayed that shows the current server status, and has the following color dot (and tooltip indicators):

* 🟢 (green) - the server is up and running, everything is fine, no issues detected
* 🟡 (yellow) - the server is up and running, but there is a command in progress (likely [maintenance](https://etke.cc/help/extras/scheduler/#maintenance)), so some temporary issues may occur - that's totally fine
* 🔴 (red) - there is at least 1 issue with one of the server's components

### Server Status Page

![Server Status Page](../../../screenshots/etke.cc/server-status/page.webp)

When you click on the [Server Status icon](#server-status-icon) in the application bar, you will be redirected to the
Server Status page. This page contains the following information:

* Overall server status (up/updating/has issues)
* Details about the currently running command (if any)
* Details about the server's components statuses (up/down with error details and suggested actions) by categories
