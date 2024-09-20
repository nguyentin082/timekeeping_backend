-- Create companies table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    date_of_birth VARCHAR(50),
    position VARCHAR(100),
    last_status VARCHAR(50) DEFAULT 'unknown' CHECK (last_status IN ('check-in', 'check-out', 'unknown')),
    company_id INT REFERENCES companies(id) ON DELETE SET NULL,
    refresh_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create timekeeping table
CREATE TABLE timekeeping (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL CHECK (status IN ('check-in', 'check-out')),
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update the last_status in users table
CREATE OR REPLACE FUNCTION update_last_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the last_status in the users table based on the latest entry in timekeeping
    UPDATE users
    SET last_status = NEW.status
    WHERE id = NEW.user_id;

    -- Return the new timekeeping record (standard for AFTER INSERT triggers)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that will call the update_last_status function after a new record in timekeeping
CREATE TRIGGER after_timekeeping_insert
AFTER INSERT ON timekeeping
FOR EACH ROW
EXECUTE FUNCTION update_last_status();

-- Optional: Update last_status if no timekeeping records exist for a user
CREATE OR REPLACE FUNCTION update_last_status_on_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- If the deleted record was the latest timekeeping record, update last_status to 'unknown'
    IF NOT EXISTS (
        SELECT 1 FROM timekeeping WHERE user_id = OLD.user_id
    ) THEN
        UPDATE users
        SET last_status = 'unknown'
        WHERE id = OLD.user_id;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to handle deletion of timekeeping records and update last_status accordingly
CREATE TRIGGER after_timekeeping_delete
AFTER DELETE ON timekeeping
FOR EACH ROW
EXECUTE FUNCTION update_last_status_on_delete();
