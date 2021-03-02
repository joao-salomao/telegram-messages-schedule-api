CREATE TABLE groups (
    id INTEGER NOT NULL,
    telegram_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (telegram_id)
);

CREATE TABLE messages (
    id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL,
    date_time TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE groups_messages (
    message_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (message_id, group_id),
    FOREIGN KEY(message_id) REFERENCES messages (id) ON DELETE CASCADE,
    FOREIGN KEY(group_id) REFERENCES groups (id) ON DELETE CASCADE
);
