package com.cardiff.maplife.exploreTest;

import com.cardiff.maplife.entities.Event;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;


@SpringBootTest
class EventUnitTest {
    private static Event event;

    @Test
    void eventDTOTest()  {
        Event event = new Event(1l,"Iron Maiden");
        assertEquals(event.getHost_id(), 1l);
        assertEquals(event.getEvent_title(), "Iron Maiden");

    }





}
