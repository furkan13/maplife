package com.cardiff.maplife.repositories;


import com.cardiff.maplife.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    //save the user
    User save(User user);

    //find all users
//    Set<User> findAllUser();

//    //find user by id
//    Optional<User> findAllById(long id);

    // find user by username
//    Optional<User> findUserByUsername(String username);
    User findUserByUsername(String username);
    //find username and password
//    Optional<User> findUserByPassword(String password);



}
