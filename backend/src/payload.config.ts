// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { fileURLToPath } from 'url';
import { dirname as pathDirname, resolve } from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';

// @ts-ignore
import { Users } from './collections/Users';
// @ts-ignore
import { Media } from './collections/Media';
// @ts-ignore
import { Subscribers } from './collections/Subscribers';
// @ts-ignore
import emailAdapter from './email/sesAdapter';

const filename = fileURLToPath(import.meta.url);
const dirname = pathDirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: resolve(dirname),
    },
  },
  collections: [Users, Media, Subscribers],
  editor: lexicalEditor(),
  secret: process.env.YUZZI_PAYLOAD_SECRET || '',
  typescript: {
    outputFile: resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.YUZZI_DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  email: emailAdapter,
  cors:
    process.env.NODE_ENV === 'production'
      ? [process.env.YUZZI_FRONTEND_URL || 'https://yuzzi.com']
      : '*', // Allow all origins in development
  csrf:
    process.env.NODE_ENV === 'production'
      ? [process.env.YUZZI_FRONTEND_URL || 'https://yuzzi.com']
      : [], // Disable CSRF in development
});
