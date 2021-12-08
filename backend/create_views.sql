CREATE OR REPLACE VIEW budgetBuddy.badges_earned AS
  SELECT
  row_number() OVER () as badge_id,
  u.user_id,
  ch.challenge_name as badge_name,
  ch.challenge_description as badge_description,
  ci.challenge_completion as badge_completion
  FROM
  budgetBuddy.challenge_inventory ci
  INNER JOIN budgetBuddy.users u
  ON ci.user_id = u.user_id
  INNER JOIN budgetBuddy.challenge ch
  ON ci.challenge_id = ch.challenge_id
 WHERE ci.challenge_completion IS NOT NULL;
