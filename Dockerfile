# ──────────────────────────────────────────────────────────────────────────────
# Dockerfile – TramEvents Formular
# Rulează aplicația statică în Nginx (Alpine) pe portul 80
# ──────────────────────────────────────────────────────────────────────────────

FROM nginx:1.27-alpine

# Elimină configurația default Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiază fișierele aplicației
COPY app/ /usr/share/nginx/html/

# Configurație Nginx personalizată — servire statică simplă
RUN printf 'server {\n\
    listen       80;\n\
    listen  [::]:80;\n\
    server_name  localhost;\n\
    root   /usr/share/nginx/html;\n\
    index  index.html;\n\
\n\
    # Security headers\n\
    add_header X-Frame-Options "SAMEORIGIN" always;\n\
    add_header X-Content-Type-Options "nosniff" always;\n\
    add_header X-XSS-Protection "1; mode=block" always;\n\
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;\n\
\n\
    # Compresie gzip\n\
    gzip on;\n\
    gzip_types text/plain text/css application/javascript;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    # Cache pentru assets statice\n\
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
\n\
    error_page 404 /index.html;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck — verifică că Nginx răspunde
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
