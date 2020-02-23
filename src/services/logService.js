import * as Sentry from "@sentry/browser";

function init() {
  Sentry.init({
    dsn: "https://c04cda9dd68942d69ddceaff18fbeee9@sentry.io/2792679"
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log
};
