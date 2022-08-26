package com.cardiff.maplife.entities;

import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Table(name = "live")

@Component
public class Live {
    public Live(){
    }
    public Live(long id, long eventid, long cohostid, boolean approved){
        this.id = id;
        this.eventid = eventid;
        this.cohostid = cohostid;
        this.approved = approved;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id")
    private Long id;
    @Column(name = "eventid")
    private long eventid;
    @Column(name = "cohostid")
    private long cohostid;
    @Column(name = "approved")
    private boolean approved;
    @Transient
    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getEventid() {
        return eventid;
    }

    public void setEventid(long eventid) {
        this.eventid = eventid;
    }

    public long getCohostid() {
        return cohostid;
    }

    public void setCohostid(long cohostid) {
        this.cohostid = cohostid;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }
}
