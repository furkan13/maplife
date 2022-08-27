package com.cardiff.maplife.repositories;


import com.cardiff.maplife.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    //save the user
    User save(User user);

    //find all users
//    Set<User> findAllUser();

//    //find user by id
//    Optional<User> findAllById(long id);
    User findById(long id);
    // find user by username
//    Optional<User> findUserByUsername(String username);
    User findUserByUsername(String username);
    //find username and password
//    Optional<User> findUserByPassword(String password);


    void deleteById(Long id);

}
