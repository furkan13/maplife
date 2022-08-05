package com.cardiff.maplife.entities;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "event")

public class Event {
    public Event() {

    }
    public Event(Long id, long host_id, String event_link, String event_title, double longitude, double latitude, boolean room_type, Date event_date, String event_dis) {
        this.id = id;
        this.host_id = host_id;
        this.event_link = event_link;
        this.event_title = event_title;
        this.longitude = longitude;
        this.latitude = latitude;
        this.room_type = room_type;
        this.event_date = event_date;
        this.event_dis = event_dis;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "eventId")
    private Long id;

    @Column(name = "host_id")
    private Long host_id;

    @Column(name = "event_link")
    private String event_link;
    @Column(name = "event_title")
    private String event_title;
    @Column(name = "room_type")
    private boolean room_type;
    @Column(name = "longitude")
    private double longitude;
    @Column(name = "latitude")
    private double latitude;
    @Column(name = "event_date")
    private Date event_date;
    @Column(name = "event_dis")
    private String event_dis;

}
