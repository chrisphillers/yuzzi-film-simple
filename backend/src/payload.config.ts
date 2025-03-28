// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Subscribers } from './collections/Subscribers';
import emailAdapter from './email/sesAdapter';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Subscribers],
  editor: lexicalEditor(),
  secret: process.env.YUZZI_PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
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
