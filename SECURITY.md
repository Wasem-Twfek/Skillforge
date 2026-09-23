# Security Policy

## Reporting a vulnerability

Please report security issues privately to the repository owner rather than opening a public issue containing sensitive details.

When reporting, include:
- A clear description of the issue
- Steps to reproduce
- The affected component or endpoint
- Any relevant logs or proof of concept that can be shared safely

## Credential handling

SkillForge expects secrets such as JWT_SECRET, SESSION_SECRET, Google OAuth client credentials, and database credentials to be supplied through environment variables or a deployment secret manager.

Never commit .env files or production credentials.

## Historical credentials

Credentials that were previously committed to Git history should be treated as compromised. Rotate or revoke them and remove the sensitive objects from repository history before reusing them.

## Local development

Use the provided .env.example files as templates. Replace placeholder values locally and keep the resulting environment files untracked.
