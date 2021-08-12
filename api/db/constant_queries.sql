UPDATE actions
SET signed = CASE 
WHEN (CAST(CURRENT_TIMESTAMP AS DATE) > date) 
    THEN 
        'closed late' 
    ELSE 
        'closed' 
    END,
closed = CURRENT_TIMESTAMP;