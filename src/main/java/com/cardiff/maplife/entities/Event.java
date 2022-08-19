package com.cardiff.maplife.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "event")

public class Event {
    public Event() {

    }
    public Event(Long id, long host_id, String event_link, String title, double longitude, double latitude, boolean room_type, Date event_date, String event_dis, String Object) {
        this.id = id;
        this.host_id = host_id;
        this.event_link = event_link;
        this.title = title;
        this.longitude = longitude;
        this.latitude = latitude;
        this.room_type = room_type;
        this.event_date = event_date;
        this.event_dis = event_dis;
        this.Object = Object;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "eventId")
    private Long id;
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
    @JsonIgnoreProperties("Object")
    @Column(name = "Object", columnDefinition = "json")
    private String Object;


//    public void SetEventId(long id){
//        this.id = id;
//    }
//    public void SetHostId(long id){
//        this.host_id = id;
//    }
//    public void SetLink(String link){
//        this.event_link = link;
//    }
//    public void SetTitle(String title){
//        this.event_title = title;
//    }
//    public void SetRoomType(boolean type){
//        this.room_type = type;
//    }
//    public void SetLongitude(double longitude){
//        this.longitude = longitude;
//    }
//    public void SetLatitude(double latitude){
//        this.latitude = latitude;
//    }
//    public void SetDate(Date date){
//        this.event_date = date;
//    }
//    public void SetDescription(String dis){
//        this.event_dis = dis;
//    }
//    public long GetEventId(){
//        return this.id;
//    }
//    public long GetHostId(){
//        return this.host_id;

    public String getObject() {
        return Object;
    }

    public void setObject(String object) {
        Object = object;
    }
//    }
//    public String GetLink(){
//        return this.event_link ;
//    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHost_id() {
        return host_id;
    }

    public void setHost_id(Long host_id) {
        this.host_id = host_id;
    }

    public String getEvent_link() {
        return event_link;
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

    public boolean isRoom_type() {
        return room_type;
    }

    public void setRoom_type(boolean room_type) {
        this.room_type = room_type;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public Date getEvent_date() {
        return event_date;
    }

    public void setEvent_date(Date event_date) {
        this.event_date = event_date;
    }

    public String getEvent_dis() {
        return event_dis;
    }

    public void setEvent_dis(String event_dis) {
        this.event_dis = event_dis;
    }

//    public String GetTitle(){
//        return this.event_title;
//    }
//    public boolean GetRoomType(){
//        return this.room_type;
//    }
//    public double GetLongitude(){
//        return this.longitude;
//    }
//    public double GetLatitude(){
//        return this.latitude;
//    }
//    public Date SetDate(){
//        return this.event_date;
//    }
//    public String SetDescription(){
//        return this.event_dis;
//    }

    public static class UserRepository {
    }
}
