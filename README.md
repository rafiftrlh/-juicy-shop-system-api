# 🍹 Juicy Shop System API

Welcome to the **Juicy Shop System API**! This project is designed to help manage inventory, orders, and transactions in a juice business. The backend is built using Express.js, and Supabase is used as the database.

## 🚀 Getting Started

Follow the steps below to set up and run the project on your local machine.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **Supabase Account**: Sign up for a free Supabase account at [supabase.com](https://supabase.com/).

### Installation

1. **Clone the repository:**

  ```bash
   git clone https://github.com/rafiftrlh/juicy-shop-api.git
   cd juicy-shop-api
  ```

2. **Install dependencies:**

  ```bash
  npm install
  ```

3. **Set up environment variables:**

Create a .env file in the root directory of your project and add your Supabase credentials:
  ```bash
  SUPABASE_URL=your-supabase-url
  SUPABASE_KEY=your-supabase-key
  PORT=3000
  ```

### Database Setup
1. **Enable the pgcrypto extension for UUIDs:**

  ```sql
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  ```

2. **Create a function to update timestamp:**

  ```sql
  CREATE OR REPLACE FUNCTION update_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  ```

3. **Create ENUM Types:**

  ```sql
  CREATE TYPE role_enum AS ENUM ('admin', 'cashier', 'juicer', 'warehouse');
  CREATE TYPE member_status_enum AS ENUM ('active', 'inactive');
  CREATE TYPE order_status_enum AS ENUM ('waiting', 'cooking', 'ready to pick', 'done',  'cancelled');
  CREATE TYPE inventory_action_enum AS ENUM ('in', 'out');
  ```

4. **Create Tables:**

  ```sql
  -- Tabel system_users
  CREATE TABLE IF NOT EXISTS system_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role role_enum NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
  );

  CREATE TRIGGER update_system_users_timestamp
  BEFORE UPDATE ON system_users
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

  ALTER TABLE system_users REPLICA IDENTITY FULL;

  -- Tabel members
  CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    status member_status_enum NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
  );

  CREATE TRIGGER update_members_timestamp
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

  ALTER TABLE members REPLICA IDENTITY FULL;

  -- Tabel juices
  CREATE TABLE IF NOT EXISTS juices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
  );

  CREATE TRIGGER update_juices_timestamp
  BEFORE UPDATE ON juices
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

  ALTER TABLE juices REPLICA IDENTITY FULL;

  -- Tabel categories
  CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TRIGGER update_categories_timestamp
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

  ALTER TABLE categories REPLICA IDENTITY FULL;

  -- Tabel inventory
  CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TRIGGER update_inventory_timestamp
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

  ALTER TABLE inventory REPLICA IDENTITY FULL;

  -- Tabel juice_ingredients
  CREATE TABLE IF NOT EXISTS juice_ingredients (
    id SERIAL PRIMARY KEY,
    juice_id INT REFERENCES juices(id) ON DELETE CASCADE,
    inventory_id INT REFERENCES inventory(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
  );

  CREATE TRIGGER update_juice_ingredients_timestamp
  BEFORE UPDATE ON juice_ingredients
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

  ALTER TABLE juice_ingredients REPLICA IDENTITY FULL;

  -- Tabel orders
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_by VARCHAR(255) NOT NULL,
    member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    order_status order_status_enum NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TRIGGER update_orders_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

  ALTER TABLE orders REPLICA IDENTITY FULL;

  -- Tabel order_items
  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    juice_id INT REFERENCES juices(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sum_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TRIGGER update_order_items_timestamp
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

  ALTER TABLE order_items REPLICA IDENTITY FULL;

  -- Tabel inventory_logs
  CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    quantity_changed INT NOT NULL,
    action inventory_action_enum NOT NULL,
    reason VARCHAR(255),
    changed_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
  );

  -- Tabel order_transaction_logs
  CREATE TABLE IF NOT EXISTS order_transaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_price DECIMAL(10, 2) NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    amount_returned DECIMAL(10, 2) NOT NULL,
    served_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
  );

    -- Tabel order_items_transaction_logs
  CREATE TABLE IF NOT EXISTS order_items_transaction_logs (
    id SERIAL PRIMARY KEY,
    order_logs_id UUID REFERENCES order_transaction_logs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sum_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  );

  -- Tabel member_topup_logs
  CREATE TABLE IF NOT EXISTS member_topup_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    processed_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
  );
  ```

5. **Create Bucket**
  ```sql
  -- Create a new bucket named 'images'
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('images', 'images', true);

  -- Set a public access policy for bucket 'images'
  CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'images' );
  ```

6. **Storage Policies**
   1. Go to the “Storage” section.
   2. Select the “Policies” tab in the “Configuration” section.
   3. Click “New Policy” in the “images” section.
   4. Select “Create a policy from scratch”.
   5. Fill out the policy form with the following information:
     
      - Policy name: Allow image uploads
      - Allowed operation: INSERT
      - Policy definition:
        ```sql
        bucket_id = 'images'::text
        ```
   6. Click “Review” and then “Save policy”.


### Running the Application

1. **Start the server:**
  ```bash
  npm start
  ```

2. **Access the application:**

Open your browser and navigate to http://localhost:3000.

## 🎉 Features
- User Management: Manage users with different roles like admin, cashier, juicer, and warehouse staff.
- Inventory Tracking: Keep track of inventory items, categorize them, and log changes.
- Order Management: Manage orders, track their status, and log transactions.
- Member System: Handle member registrations, top-ups, and balance management.

## 🛠 Technologies Used
- Express.js: A web application framework for Node.js.
- Supabase: An open-source Firebase alternative for database management.
- PostgreSQL: The database system used by Supabase.
- Socket.IO: A library for real-time communication between clients and servers over WebSocket.
- HTTP: The underlying protocol used to transfer data between the server and client, often paired with Socket.IO for establishing connections.