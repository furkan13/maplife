package com.cardiff.maplife.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name = "followingUser")
public class FollowingUser {
  //    @JsonIgnoreProperties("followingUserSet")
//    @ManyToMany(mappedBy = "followingUserSet", fetch = FetchType.EAGER)
//    private Set<UserObject> userObjectSet = new HashSet<>();
  public FollowingUser(){

  }
  public FollowingUser(Long id){
    this.id=id;
  }
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  public void setId(Long id) {
    this.id = id;
  }
  public Long getId() {
    return id;
  }
}
