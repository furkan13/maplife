package com.cardiff.maplife.repositories;

import com.cardiff.maplife.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreamRepository extends CrudRepository<User, Long> {
}
