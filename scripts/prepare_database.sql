/* Database Preparation Scripts */

/* Dropping Tables */
drop table if exists messages;
drop table if exists users;

/* Tables */

create table users (
    id bigserial not null primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    avatar varchar(1000)
);

create table messages (
    id bigserial not null primary key,
    user_id bigint not null references users(id),
    timestamp timestamp,
    read_at timestamp,
    read boolean default false,
    subject text,
    detail text
);


/* Demo Data */

insert into users (name, email, avatar) values ('John Doe', 'john.doe@aol.com', 'https://messgemebucket.s3.us-east-2.amazonaws.com/john_doe.png');
insert into users (name, email, avatar) values ('Amazon Store', 'sales@amazon.com', 'https://messgemebucket.s3.us-east-2.amazonaws.com/amazon_logo.png');
insert into users (name, email, avatar) values ('Joanna Hoffman', 'joanna.hoffman@hotmail.com', 'https://messgemebucket.s3.us-east-2.amazonaws.com/joanna_hoffman.png');
insert into users (name, email, avatar) values ('Allan Cooper', 'allancooper@gmail.com', '');

insert into messages(user_id, timestamp, read_at, read, subject, detail) values (3, current_timestamp, null, false, 'Hello World', 'Hello User! This is a demo message. Please be gentle and treat me well.');
insert into messages(user_id, timestamp, read_at, read, subject, detail) values (2, current_timestamp, null, false, 'Hot Promotion', 'Hi User, how are you doing? We are here to tell you hot news: This weekend we are going to make the hottest promotion you already heard about. We hope to see you here and buy our products. Best regards,');
insert into messages(user_id, timestamp, read_at, read, subject, detail) values (1, current_timestamp, null, false, 'Mobile Test Finished', 'Hello folks. I have finished the mobile development test. I sincerely hope you can find a person who fit your requirements, and of course, If I could help with my skills, that would be great.Kind regards,');
insert into messages(user_id, timestamp, read_at, read, subject, detail) values (4, current_timestamp, null, false, 'Meeting Today', 'Hello Friend. Could we neet today to discuss the contract terms? Best, Allan.');