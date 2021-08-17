UPDATE actions
SET signed = CASE 
WHEN (CAST(CURRENT_TIMESTAMP AS DATE) > date) 
    THEN 
        'closed late' 
    ELSE 
        'closed' 
    END,
closed = CURRENT_TIMESTAMP;

UPDATE actions SET signed = 'expired' WHERE CAST(CURRENT_TIMESTAMP AS DATE) > date;