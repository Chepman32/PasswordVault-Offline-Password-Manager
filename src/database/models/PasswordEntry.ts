/**
 * WatermelonDB Model for Password Entries
 */

import {Model} from '@nozbe/watermelondb';
import {field, readonly, date, json} from '@nozbe/watermelondb/decorators';
import {PasswordCategory, PasswordStrength, CustomField} from '@/types';

export default class PasswordEntryModel extends Model {
  static table = 'password_entries';

  @field('title') title!: string;
  @field('username') username!: string;
  @field('password') password!: string;
  @field('url') url?: string;
  @field('notes') notes?: string;
  @field('category') category!: PasswordCategory;
  @field('is_favorite') isFavorite!: boolean;

  @json('tags', (json) => json) tags!: string[];
  @json('custom_fields', (json) => json) customFields!: CustomField[];

  @field('strength') strength?: PasswordStrength;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('last_accessed_at') lastAccessedAt?: Date;
}
