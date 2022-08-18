package com.cardiff.maplife.exploreTest;

import com.cardiff.maplife.controllers.ExplorerController;
import com.cardiff.maplife.repositories.EventRepository;
import com.cardiff.maplife.services.EventService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.stereotype.Service;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@RunWith(SpringRunner.class)

@WebMvcTest(ExplorerController.class)

public class ExploreLightWeightTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    EventRepository eventRepository;

    @MockBean
    EventService eventService;




    @Test
    public void testExplorePage() throws Exception {
        this.mockMvc.perform(get("/explore").with(SecurityMockMvcRequestPostProcessors.user("user").roles("USER"))).andDo(print()).andExpect(status().isOk())

                .andExpect(content().string(containsString("explore-page")));
    }


    @Test
    public void testNearByPage() throws Exception {
        this.mockMvc.perform(get("/nearby").with(SecurityMockMvcRequestPostProcessors.user("user").roles("USER"))).andDo(print()).andExpect(status().isOk())

                .andExpect(content().string(containsString("nearby-page")));
    }
    @Test
    public void testTrendingByPage() throws Exception {
        this.mockMvc.perform(get("/trending").with(SecurityMockMvcRequestPostProcessors.user("user").roles("USER"))).andDo(print()).andExpect(status().isOk())

                .andExpect(content().string(containsString("trending-page")));
    }





}
