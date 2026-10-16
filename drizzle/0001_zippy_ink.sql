PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`company` text NOT NULL,
	`role` text NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT '待跟进' NOT NULL,
	`priority` text DEFAULT 'A' NOT NULL,
	`contact` text DEFAULT '' NOT NULL,
	`next_action` text DEFAULT '核验具体 JD' NOT NULL,
	`follow_up_date` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_applications`("id", "user_id", "company", "role", "location", "url", "status", "priority", "contact", "next_action", "follow_up_date", "notes", "created_at", "updated_at") SELECT "id", "user_id", "company", "role", "location", "url", "status", "priority", "contact", "next_action", "follow_up_date", "notes", "created_at", "updated_at" FROM `applications`;--> statement-breakpoint
DROP TABLE `applications`;--> statement-breakpoint
ALTER TABLE `__new_applications` RENAME TO `applications`;--> statement-breakpoint
PRAGMA foreign_keys=ON;