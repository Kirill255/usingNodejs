// решил использовать для todo app базу sqlite3
const sqlite3 = require('sqlite3').verbose(); 
const db = new sqlite3.Database('todo.db');

module.exports = db;
// данные что бы создать базу для начала
/*
CREATE TABLE TaskTodo(
    id INTEGER PRIMARY KEY,
    Title VARCHAR(255),
    Describe VARCHAR(255),
    Done NUMERIC DEFAULT 0,
    CreateTIME TIME DEFAULT CURRENT_TIME,
    CreateDATE DATE DEFAULT CURRENT_DATE
);

INSERT INTO TaskTodo
(Title, Describe) 
VALUES ('Test Task', 'Some description for task');
INSERT INTO TaskTodo
(Title, Describe) 
VALUES ('Test things', 'Some describe for things');
INSERT INTO TaskTodo
(Title, Describe) 
VALUES ('Things', 'My description Things');
INSERT INTO TaskTodo
(Title, Describe) 
VALUES ('Task4', 'Bla Bla Bla Bla');
INSERT INTO TaskTodo
(Title, Describe) 
VALUES ('What is this', 'Its a 5 task');
INSERT INTO TaskTodo
(Title, Describe, Done) VALUES ('Done Task', 'Some bla for task', 1);

// именно под эти поля, я подогнал отображение в моей консоли, тока вводить по очереди, чёта всё разом не работало, хотя должно было
.headers on
.mode column
.width 3 10 24 4 10 10
// ну или так
.width 3 10 20 5 10 10
*/