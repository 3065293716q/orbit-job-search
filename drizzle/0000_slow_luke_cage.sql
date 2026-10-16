CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`company` text NOT NULL,
	`role` text NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT '关注' NOT NULL,
	`priority` text DEFAULT 'A' NOT NULL,
	`contact` text DEFAULT '' NOT NULL,
	`next_action` text DEFAULT '核验具体 JD' NOT NULL,
	`follow_up_date` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
