FROM fonoster/base
COPY . /scripts
RUN ./install.sh
RUN npm install --save-dev eslint@"<8.0.0"
RUN node_modules/.bin/next build
USER fonoster
HEALTHCHECK --interval=30s \
  --timeout=30s \
  --start-period=5s \
  --retries=3 \
  CMD [ "healthcheck" ]