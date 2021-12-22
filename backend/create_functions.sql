
/* Imagine challenge with ID 1 is for a user to record their first income transaction. */
CREATE or replace FUNCTION budgetBuddy.validate_challenge_1(userId bigint)
  RETURNS BOOLEAN AS
$func$
DECLARE
   _numReceipts bigint := (SELECT COUNT(DISTINCT r.receipt_id)
		FROM budgetBuddy.receipt r
		WHERE r.user_id = userId
		AND is_income = TRUE);
BEGIN	
   RETURN _numReceipts > 0;   
END
$func$ LANGUAGE plpgsql;

/* Imagine challenge with ID 2 is for a user to record their first spending transaction. */
CREATE or replace FUNCTION budgetBuddy.validate_challenge_2(userId bigint)
  RETURNS BOOLEAN AS
$func$
DECLARE
   _numReceipts bigint := (SELECT COUNT(DISTINCT r.receipt_id)
		FROM budgetBuddy.receipt r
		WHERE r.user_id = userId
		AND is_income = FALSE);
BEGIN	
   RETURN _numReceipts > 0;   
END
$func$ LANGUAGE plpgsql;

/* Call functions with a SELECT statement .....
SELECT budgetBuddy.validate_challenge_1(2)
*/