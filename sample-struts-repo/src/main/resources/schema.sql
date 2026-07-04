create table orders (
  id bigint primary key,
  customer_id varchar(64) not null,
  order_total numeric(12,2) not null
);
