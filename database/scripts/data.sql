INSERT INTO users VALUES 
    (1003, 'Fritz', 'Schmidt', 'Straße', 12, 12345,'Stadt','fritz@schmidt.de', '$2b$10$y0C/GgvEKk41eskxqDAysuBREb6wOCGmCwZoyXtZ4xTwavzkFktD.'),
	(1004, 'Thomas', 'Meier', 'Straße', 12, 12345,'Stadt','thomas@m.de', '$2b$10$y0C/GgvEKk41eskxqDAysuBREb6wOCGmCwZoyXtZ4xTwavzkFktD.'),
	(1005, 'Petra', 'Beiruth', 'Straße', 12, 12345,'Stadt','petra@beiruth.de', '$2b$10$y0C/GgvEKk41eskxqDAysuBREb6wOCGmCwZoyXtZ4xTwavzkFktD.'),
	(1006, 'Leonie', 'Schneider', 'Straße', 12, 12345,'Stadt','leonie@s.de', '$2b$10$y0C/GgvEKk41eskxqDAysuBREb6wOCGmCwZoyXtZ4xTwavzkFktD.'),
	(1007, 'Jonas', 'Hermann', 'Straße', 12, 12345,'Stadt','jonas@hermann.de', '$2b$10$y0C/GgvEKk41eskxqDAysuBREb6wOCGmCwZoyXtZ4xTwavzkFktD.'),
	(1008, 'Gabriel', 'Richard', 'Straße', 12, 12345,'Stadt','gabriel@richard.de', '$2b$10$y0C/GgvEKk41eskxqDAysuBREb6wOCGmCwZoyXtZ4xTwavzkFktD.');

INSERT INTO orders VALUES
(10000, 'f111b418-24ca-48e2-8ae5-41a916b0de6f', 25.00,1003,'2023-07-16 17:48:07','swpsafe'), 
(10001, 'f111b418-24ca-49a2-8ae5-41a916b0de6f', 25.00,1003,'2023-01-16 17:48:07','swpsafe'),
(10002, 'f111b418-24ca-50b2-8ae5-41a916b0de6f', 25.00,1003,'2023-07-16 17:48:07','swpsafe'),
(10003, 'f111b418-24ca-51d2-8ae5-41a916b0de6f', 25.00,1003,'2023-01-16 17:48:07','swpsafe');

INSERT INTO tickets VALUES 
(default,1,1003,5,10000),
(default,0,1004,4,10001),
(default,0,1003,1,10002),
(default,0,1003,4,10003),
(default,0,1003,4,10003);

INSERT INTO evaluation VALUES
    (DEFAULT,1003,17,FALSE,5,'Es war eine phänomenale Erfahrung!'),
    (DEFAULT,1004,17,FALSE,5,'Wirklich gut, werde 2024 sicher wiederkommen! :)'),
    (DEFAULT,1005,17,TRUE,4,'Hat uns sehr gefallen!'),
    (DEFAULT,1006,17,TRUE,4,'Auch wenn es erst verspätet gestartet ist, hatte ich trotzdem Spaß!'),
    (DEFAULT,1007,17,TRUE,2,'Organisatoren kamen 20 Minuten zu spät. Super unprofessionell!'),
    (DEFAULT,1008,17,FALSE,1,'Ticket zu teuer');

INSERT INTO helpful VALUES 
   (DEFAULT, 1, 1003, TRUE),
   (DEFAULT, 4, 1008, TRUE),
   (DEFAULT, 1, 1004, TRUE),
   (DEFAULT, 2, 1004, TRUE),
   (DEFAULT, 2, 1005, TRUE),
   (DEFAULT, 2, 1008, TRUE),
   (DEFAULT, 5, 1004, TRUE),
   (DEFAULT, 6, 1005, FALSE),
   (DEFAULT, 6, 1006, FALSE),
   (DEFAULT, 6, 1003, FALSE);

INSERT INTO users VALUES (1009, 'Benjamin', 'Schneider', 'Beurer-Straße', '12a', 78224, 'Singen', 'ben@schneider.de', '$2b$10$y0C/GgvEKk41eskxqDAysuBREb6wOCGmCwZoyXtZ4xTwavzkFktD.');

INSERT INTO orders VALUES (10004, 'test', 15.00,1009, NOW(), 'swpsafe');

INSERT INTO tickets VALUES (default, 0, 1009, 17, 10004);
INSERT INTO tickets VALUES (default, 0, 1009, 31, 10004);