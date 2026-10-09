-- Add icon column to team_members
ALTER TABLE team_members ADD COLUMN icon text;

-- Restore original icons based on name
UPDATE team_members SET icon = 'Crown' WHERE name = 'Sivamanikandan P';
UPDATE team_members SET icon = 'Target' WHERE name = 'Rithanya RS';
UPDATE team_members SET icon = 'Search' WHERE name = 'Raghul Raja V';
UPDATE team_members SET icon = 'Share2' WHERE name = 'Shivaranjani K';
UPDATE team_members SET icon = 'Film' WHERE name = 'Sarathy';
