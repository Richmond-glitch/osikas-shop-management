CREATE TABLE `debts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`saleId` int NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`amount` varchar(20) NOT NULL,
	`status` enum('pending','paid') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `debts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('Restocking','Rent','Utilities','Transport','Salary','Other') NOT NULL,
	`description` text,
	`amount` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) DEFAULT 'Other',
	`buyingPrice` varchar(20) NOT NULL,
	`sellingPrice` varchar(20) NOT NULL,
	`quantity` int NOT NULL DEFAULT 0,
	`minStockAlert` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(255),
	`totalAmount` varchar(20) NOT NULL,
	`paymentStatus` enum('paid','credit') DEFAULT 'paid',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salesItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`saleId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`unitPrice` varchar(20) NOT NULL,
	`subtotal` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `salesItems_id` PRIMARY KEY(`id`)
);
