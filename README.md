# FloatDesk releases

This repository hosts Windows installers and the verified update feed for FloatDesk, a local-first reseller operations desk.

Get installers from [Releases](https://github.com/hyperfloater/floatdesk-releases/releases). FloatDesk stores each user's workspace locally; this repository contains distribution assets, not user records.

## Free updates

The updater-enabled desktop edition checks the latest `floatdesk-update.json` release asset, verifies it using the public key bundled in the app, and verifies the installer's SHA-256 before running it. Updates require your approval and preserve the existing data folder. Back up before updating.

Users on version 0.2.0 need one manual installation of an updater-enabled build. Later releases can be offered inside FloatDesk.

These preview installers are unsigned to Windows. FloatDesk release signatures provide updater authenticity; they do not provide Windows Authenticode publisher verification or guarantee removal of SmartScreen warnings.

No checkout, Discord posting, or paid shipping action happens automatically.
