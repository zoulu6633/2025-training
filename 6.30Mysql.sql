CREATE TABLE Book(
ID VARCHAR(50) PRIMARY KEY,
Title VARCHAR(50) NOT NULL,
Author varchar(50),
Stock INT
);

CREATE TABLE Person(
ID INT PRIMARY KEY,
Name VARCHAR(50) NOT NULL
);

CREATE TABLE ReadBook(
Pid INT,
Name VARCHAR(50) NOT NULL,
Bid VARCHAR(50),
Title VARCHAR(50) NOT NULL,
FOREIGN KEY(Pid) REFERENCES Person(ID),
FOREIGN KEY(Bid) REFERENCES Book(ID)
);

INSERT INTO Book VALUES("go-away","the way to go","lvo",20);
INSERT INTO Book VALUES("go-lang","Go语言圣经","Alan,Brain",17);
INSERT INTO Book VALUES("go-web","Go Web编程","Anonymous",4);
INSERT INTO Book VALUES("con-cur","Concurrency in Go","Katherine",9);

INSERT INTO Person VALUES(1,"小明");
INSERT INTO Person VALUES(2,"张三");
INSERT INTO Person VALUES(3,"翟曙");

INSERT INTO ReadBook VALUES (1,"小明","go-away","the way to go");
INSERT INTO ReadBook VALUES (1,"小明","go-web","Go Web编程");
INSERT INTO ReadBook VALUES (1,"小明","con-cur","Concurrency in Go");
INSERT INTO ReadBook VALUES (2,"张三","go-away","the way to go");
INSERT INTO ReadBook VALUES (2,"张三","go-web","Go Web编程");
INSERT INTO ReadBook VALUES (3,"翟曙","con-cur","Concurrency in Go");

-- 查询喜欢阅读#3的人
SELECT Name FROM ReadBook where Bid="go-web";
-- 查询没有被喜欢阅读的书的信息(id,作者,标题,库存)
SELECT Book.ID,Author,Book.Title,Stock FROM Book LEFT JOIN ReadBook ON ID=Bid 
WHERE Pid is NULL;
-- 查询哪些人喜欢哪本书,列出人名和书名
SELECT Name,Title FROM ReadBook;