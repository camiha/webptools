# Release

The `publish` workflow builds a universal macOS binary, signs and notarizes it
with an Apple Developer ID certificate, signs the updater package, and attaches
`latest.json` to a draft GitHub release.

## Required GitHub secrets

| secret | value |
| --- | --- |
| `APPLE_CERTIFICATE` | base64 of the exported `Developer ID Application` `.p12` |
| `APPLE_CERTIFICATE_PASSWORD` | password set when exporting the `.p12` |
| `APPLE_SIGNING_IDENTITY` | e.g. `Developer ID Application: Your Name (TEAMID)` |
| `APPLE_API_ISSUER` | App Store Connect API issuer id (UUID) |
| `APPLE_API_KEY` | App Store Connect API key id (10 chars) |
| `APPLE_API_KEY_BASE64` | base64 of the `AuthKey_<KEYID>.p8` file |
| `TAURI_SIGNING_PRIVATE_KEY` | contents of the updater private key |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | password of the updater private key (empty if none) |

## 1. Developer ID Application certificate

1. Create a certificate signing request:
   Keychain Access -> Certificate Assistant -> Request a Certificate From a Certificate Authority,
   choose "Saved to disk".
2. On <https://developer.apple.com/account/resources/certificates/list>, create a
   certificate of type **Developer ID Application** and upload the CSR.
3. Download the `.cer`, double click it to install into the login keychain.
4. In Keychain Access, select the certificate together with its private key and
   export as `.p12` with a password.
5. Register the secrets:

```sh
base64 -i /path/to/certificate.p12 | gh secret set APPLE_CERTIFICATE
gh secret set APPLE_CERTIFICATE_PASSWORD
security find-identity -v -p codesigning   # copy the "Developer ID Application: ..." line
gh secret set APPLE_SIGNING_IDENTITY
```

## 2. App Store Connect API key (notarization)

1. On <https://appstoreconnect.apple.com/access/integrations/api>, create a key
   with the **Developer** role and download the `AuthKey_<KEYID>.p8`.
   The file can only be downloaded once.
2. Copy the Issuer ID shown above the key list, and the Key ID of the key.
3. Register the secrets:

```sh
gh secret set APPLE_API_ISSUER        # Issuer ID (UUID)
gh secret set APPLE_API_KEY           # Key ID
base64 -i /path/to/AuthKey_<KEYID>.p8 | gh secret set APPLE_API_KEY_BASE64
```

## 3. Updater signing key

The key pair is independent from the Apple certificate. It signs the update
package so the installed app can verify what it downloads. The public key lives
in `src-tauri/tauri.conf.json` under `plugins.updater.pubkey`.

To generate a new pair (only needed once, or when rotating the key):

```sh
pnpm tauri signer generate -w ~/.tauri/webptools.key
```

Register the private key:

```sh
gh secret set TAURI_SIGNING_PRIVATE_KEY < ~/.tauri/webptools.key
gh secret set TAURI_SIGNING_PRIVATE_KEY_PASSWORD   # empty when generated without a password
```

Rotating the key invalidates updates for every already installed app, because
the installed build only trusts the public key it was built with.

## 4. Release flow

1. Bump `version` in `package.json` and `src-tauri/tauri.conf.json`.
   The updater compares the version in `tauri.conf.json`.
2. Push to `main`. The workflow builds and creates a **draft** release.
3. Publish the draft release on GitHub.
   Until it is published, `releases/latest/download/latest.json` still points at
   the previous release and no client sees the update.
