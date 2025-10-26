/**
 * WatermelonDB Schema for offline-first data persistence
 */

import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'password_entries',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'username', type: 'string'},
        {name: 'password', type: 'string'},
        {name: 'url', type: 'string', isOptional: true},
        {name: 'notes', type: 'string', isOptional: true},
        {name: 'category', type: 'string'},
        {name: 'is_favorite', type: 'boolean'},
        {name: 'tags', type: 'string'}, // JSON array stored as string
        {name: 'custom_fields', type: 'string'}, // JSON array stored as string
        {name: 'strength', type: 'string', isOptional: true},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
        {name: 'last_accessed_at', type: 'number', isOptional: true},
      ],
    }),
    tableSchema({
      name: 'security_audits',
      columns: [
        {name: 'entry_id', type: 'string', isIndexed: true},
        {name: 'audit_type', type: 'string'},
        {name: 'severity', type: 'string'},
        {name: 'message', type: 'string'},
        {name: 'detected_at', type: 'number'},
        {name: 'resolved', type: 'boolean'},
      ],
    }),
    tableSchema({
      name: 'notifications',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'body', type: 'string'},
        {name: 'scheduled_at', type: 'number'},
        {name: 'notification_type', type: 'string'},
        {name: 'entry_id', type: 'string', isOptional: true},
        {name: 'is_read', type: 'boolean'},
      ],
    }),
  ],
});
