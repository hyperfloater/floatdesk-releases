# FloatDesk releases

FloatDesk is a local-first reseller operations desk. This repository hosts Windows installers and the verified update feed; user records stay on the user's computer.

[Download FloatDesk 0.2.2 for Windows x64](https://github.com/hyperfloater/floatdesk-releases/releases/download/v0.2.2/FloatDesk-0.2.2-win-x64.exe) · [Release notes](https://github.com/hyperfloater/floatdesk-releases/releases/tag/v0.2.2)

Version 0.2.2 improves startup and PIN unlock recovery, rejects malformed request origins with JSON errors, and adds an explicit Copy diagnostics action with sanitized local-service status and logs. Install over the existing app to retain its workspace and PIN. Close FloatDesk and back up its complete data folder before upgrading.

## Free updates

The updater-enabled desktop edition checks the latest `floatdesk-update.json` release asset, verifies the pinned release key and installer SHA-256, and installs only with human confirmation. Version 0.2.0 needs one manual installation of an updater-enabled build. Version 0.2.1 and later include this repository's update channel.

These previews remain unsigned to Windows. FloatDesk release signatures are separate from Windows Authenticode publisher verification; SmartScreen may still warn. Automated browser, runtime and Wine checks do not establish clean Windows installer acceptance or the cause of a particular laptop failure.

No checkout, Discord posting, or paid shipping action happens automatically.
