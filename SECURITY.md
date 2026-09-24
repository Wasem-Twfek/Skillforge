# Security

## Reporting a vulnerability

Please report security issues privately instead of opening a public issue with sensitive details.

Include:

- A clear description of the issue
- Steps to reproduce it
- The affected component or endpoint
- Any logs or proof of concept that can be shared safely

## Secrets

Do not commit passwords, API keys, OAuth client secrets, JWT secrets, database credentials, or local .env files.

Use the provided .env.example files as templates and provide real values through the local environment or a deployment secret manager.

## Previously exposed credentials

Any credential that appeared in repository history should be treated as compromised. Rotate or revoke it before using a replacement credential.

## Production

Do not use development seed data in production. Review Docker port exposure, authentication settings, and secret management before deploying publicly.