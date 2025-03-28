import * as Sentry from '@sentry/nextjs';

const dsn = process.env.YUZZI_SENTRY_DSN;
if (!dsn) {
  console.warn('Sentry DSN not found in environment variables');
}

Sentry.init({
  dsn,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === 'development',
  environment: process.env.NODE_ENV,
  integrations: [
    // @ts-ignore
    new Sentry.Integrations.Http({ tracing: true }),
    // @ts-ignore
    new Sentry.Integrations.Express(),
    // @ts-ignore
    new Sentry.Integrations.Postgres(),
  ],
  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Event:', event);
    }
    return event;
  },
});
