--For each book in state:
select book, count(*) as impression_count from search_impressions, direct_impressions
where book = "book"
and year = 2013
and month = 8
group by book
order by book

select book, action, count(action) as action_count from actions
where book = "book"
and year = 2013
and month = 8
group by book, action
order by book, action