CREATE TABLE internal_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_email text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  status text DEFAULT 'UNREAD' CHECK (status IN ('READ', 'UNREAD', 'ARCHIVED')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE internal_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage internal messages" ON internal_messages FOR ALL USING (auth.role() = 'authenticated');
