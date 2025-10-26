/**
 * WatermelonDB Database initialization
 */

import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import {schema} from './schema';
import PasswordEntryModel from './models/PasswordEntry';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'PasswordVault',
  jsi: true, // Use JSI for better performance with New Architecture
  onSetUpError: (error) => {
    console.error('Database setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [PasswordEntryModel],
});

export {PasswordEntryModel};
