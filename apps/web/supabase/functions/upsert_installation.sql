CREATE OR REPLACE FUNCTION private.insert_books(title text, user_id uuid) RETURNS setof public.books AS $$
declare book_id uuid;
begin
INSERT into books (title)
values (title)
returning id into book_id;
INSERT into book_users (book_id, user_id)
values (book_id, user_id);
RETURN query
select *
from boards
where boards.id = board_id;
END $$ language plpgsql;