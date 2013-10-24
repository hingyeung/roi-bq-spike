-- Interaction break down in book (table on the left)
-- get the month 6 month in the past: (x - 6) < 1 ? 12 + ((x - 6) % 12) + 1 : (x - 6) + 1
select action, count(action)
from small_fake_roi_data.actions
where book ='<book>'
and year = '<year>'
and month = '<month>'
group by action

-- Popular interactions history for the past 6 months (line chart on the right)
SELECT year, month, action count(action) as action_count from [small_fake_roi_data.actions]
WHERE business = '<business>'
AND year >= <from_year> AND year <= <to_year>
AND month >= <from_month> AND month <= <to_month>
GROUP BY year, month, action
ORDER BY year, month