package com.cardiff.maplife.entities;

import org.springframework.stereotype.Component;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "event")


@Component
public class Event {
    public Event() {
    }
    public Event(Long id, long host_id, String event_link, String title, double longitude, double latitude, boolean room_type, Date event_date, String event_dis, boolean live) {
        this.id = id;
        this.host_id = host_id;
        this.event_link = event_link;
        this.title = title;
        this.longitude = longitude;
        this.latitude = latitude;
        this.room_type = room_type;
        this.event_date = event_date;
        this.event_dis = event_dis;
        this.live=live;
    }

    public Event(Long host_id, String event_title) {
        this.host_id = host_id;
        this.title = event_title;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    public Long getId() {
        return id;
    }

    public Long getHost_id() {
        return host_id;
    }

    public String getEvent_link() {
        return event_link;
    }

    public boolean isRoom_type() {
        return room_type;
    }

    public double getLongitude() {
        return longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public Date getEvent_date() {
        return event_date;
    }

    public String getEvent_dis() {
        return event_dis;
    }



    @ManyToOne  //creating Many to one relation with user
    @JoinColumn(name = "user_id",nullable = false) //UserId from user class will be the foreign key in the booking table
    private User user;
    @Column(name = "host_id")
    private Long host_id;
    @Column(name = "event_link")
    private String event_link;
    @Column(name = "title")
    private String title;
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

    public boolean isLive() {
        return live;
    }

    public void setLive(boolean live) {
        this.live = live;
    }

    @Column(name= "live")
    private boolean live;

    @Column(name = "cat")
    private String cat;


    public String getCat() {
        return cat;
    }

    public void setCat(String cat) {
        this.cat = cat;
    }

    String eventImageName;

    public String getEventImageName() {
        return eventImageName;
    }

    public void setEventImageName(String eventImageName) {
        this.eventImageName = eventImageName;
    }

    @Transient
    public String getPhotosImagePath() {
        if (title == null || id == -1) return null;

        //return "event/" + id + "/" + eventImageName;
        return "/event/" + id + "/" + eventImageName;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setHost_id(Long host_id) {
        this.host_id = host_id;
    }

    public void setEvent_link(String event_link) {
        this.event_link = event_link;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setRoom_type(boolean room_type) {
        this.room_type = room_type;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setEvent_date(Date event_date) {
        this.event_date = event_date;
    }

    public void setEvent_dis(String event_dis) {
        this.event_dis = event_dis;
    }

    public void setUserId(Long id)
    {
        this.getUser().setId(id);
    }

}
