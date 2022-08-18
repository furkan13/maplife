
CREATE TABLE `event` (
                         `event_id` bigint(20) NOT NULL,
                         `event_date` datetime DEFAULT NULL,
                         `event_dis` varchar(255) DEFAULT NULL,
                         `event_link` varchar(255) DEFAULT NULL,
                         `event_title` varchar(255) DEFAULT NULL,
                         `host_id` bigint(20) DEFAULT NULL,
                         `latitude` double DEFAULT NULL,
                         `longitude` double DEFAULT NULL,
                         `room_type` bit(1) DEFAULT NULL
)

    INSERT INTO `event` (`event_date`, `event_dis`, `event_link`, `event_title`, `host_id`, `latitude`, `longitude`, `room_type`) VALUES
('2022-08-14 23:19:30', 'Iron maiden concert at SU', 'youtube.com', 'Iron Mainden', 1, 1, 1, b'0');


INSERT INTO `user` (`user_id`, `coins`, `email`, `icon`, `password`, `roles`, `user_type`, `username`, `views`) VALUES ('2', '100', 'y@g.c', 'xyz', 'password', 'USER', b'0000', 'user', '11');
