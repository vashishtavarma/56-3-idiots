# EC2 deploy configs

- **edutube-api.service** — systemd unit to run the FastAPI app with uvicorn. Copy to `/etc/systemd/system/` on EC2.
- **nginx-edutube.conf** — Nginx reverse proxy so the API is served on port 80. Copy to `/etc/nginx/sites-available/` on EC2.

See [DEPLOY_EC2.md](../DEPLOY_EC2.md) for the full deployment guide.
