import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const applications = sqliteTable('applications', {
  id: integer('id').primaryKey({ autoIncrement: true }), userId: text('user_id').notNull(),
  company: text('company').notNull(), role: text('role').notNull(), location: text('location').notNull().default(''),
  url: text('url').notNull().default(''), status: text('status').notNull().default('待跟进'), priority: text('priority').notNull().default('A'),
  contact: text('contact').notNull().default(''), nextAction: text('next_action').notNull().default('核验具体 JD'),
  followUpDate: text('follow_up_date').notNull().default(''), notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull(),
});
