# Security

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue with sensitive details.

Include:

- What you found
- How to reproduce it
- The affected file or endpoint
- Any logs or proof of concept that can be shared safely

## Secrets

Do not commit:

- Passwords or API keys
- OAuth client secrets
- JWT or session secrets
- Database credentials
- Local `.env` files

Use the provided `.env.example` files for local configuration. Production secrets should come from the deployment environment or a secret manager.

## Repository history

Credentials that have appeared in Git history should be considered exposed. Rotate or revoke them before using replacement values.

## Production

Do not use development seed data in production. Before exposing the application publicly, review authentication settings, container port exposure, TLS, and secret management.
