-- Insert fake data into companies table
INSERT INTO companies (name) 
VALUES 
('TechCorp'),
('InnovateX'),
('DesignSoft'),
('FutureWorks');

-- Insert fake data into users table (Pass: 123456)
INSERT INTO users (name, email, hashed_password, date_of_birth, position, last_status, company_id)
VALUES 
('John Doe', 'john.doe@example.com', '$2b$10$Tx6nNheLE2nAPfMZ.UploeWj14AIM9PoYjhO9gW1N7K3pWtUIV8XK', '1985-07-14', 'Software Engineer', 'active', 1), 
('Jane Smith', 'jane.smith@example.com', '$2b$10$Tx6nNheLE2nAPfMZ.UploeWj14AIM9PoYjhO9gW1N7K3pWtUIV8XK', '1990-03-22', 'Project Manager', 'active', 2),
('Mike Johnson', 'mike.johnson@example.com', '$2b$10$Tx6nNheLE2nAPfMZ.UploeWj14AIM9PoYjhO9gW1N7K3pWtUIV8XK', '1995-10-11', 'UX Designer', 'on leave', 3),
('Emily Davis', 'emily.davis@example.com', '$2b$10$Tx6nNheLE2nAPfMZ.UploeWj14AIM9PoYjhO9gW1N7K3pWtUIV8XK', '1987-12-05', 'QA Tester', 'active', 1);

-- Insert fake data into images table
INSERT INTO images (image_data)
VALUES 
('fake_image_data_1'), -- Replace with actual image data or URL
('fake_image_data_2'),
('fake_image_data_3'),
('fake_image_data_4');

-- Insert fake data into timekeeping table
INSERT INTO timekeeping (status, date, time, location, user_id, image_id)
VALUES 
('check-in', '2024-09-01', '08:30:00', 'Office A', 1, 1),
('check-out', '2024-09-01', '17:30:00', 'Office A', 1, 2),
('check-in', '2024-09-01', '09:00:00', 'Office B', 2, 3),
('check-out', '2024-09-01', '18:00:00', 'Office B', 2, NULL),
('check-in', '2024-09-02', '08:45:00', 'Office C', 3, NULL),
('check-out', '2024-09-02', '17:15:00', 'Office C', 3, 4);
