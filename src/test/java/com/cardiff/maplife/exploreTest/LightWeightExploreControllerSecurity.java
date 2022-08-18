package com.cardiff.maplife.exploreTest;


import com.cardiff.maplife.controllers.ExplorerController;
import com.cardiff.maplife.services.EventService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(ExplorerController.class)

class LightWeightExploreControllerSecurity {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    public EventService eventService;

    @Test
    public void ExplorerControllerAuthorized() throws Exception {

        this.mockMvc.perform(get("/explore")
                        .with(user("user").password("password").roles("USER")))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString("explore-page")));

    }
    @Test
    public void NearbyControllerAuthorized() throws Exception {

        this.mockMvc.perform(get("/nearby")
                        .with(user("user").password("password").roles("USER")))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString("nearby-page")));

    }

    @Test
    public void TrendingControllerAuthorized() throws Exception {

        this.mockMvc.perform(get("/trending")
                        .with(user("user").password("password").roles("USER")))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString("trending-page")));

    }

    @Test
    public void ExplorerControllerUnauthorized() throws Exception {

        this.mockMvc.perform(get("/explore")
                        .with(user("user").password("password").roles("NOTADMIN")))
                .andDo(print()).andExpect(status().isForbidden());

    }
    @Test
    public void NearbyControllerUnauthorized() throws Exception {

        this.mockMvc.perform(get("/nearby")
                        .with(user("user").password("password").roles("NOTADMIN")))
                .andDo(print()).andExpect(status().isForbidden());

    }

    @Test
    public void TrendingControllerUnauthorized() throws Exception {

        this.mockMvc.perform(get("/trending")
                        .with(user("user").password("password").roles("NOTADMIN")))
                .andDo(print()).andExpect(status().isForbidden());

    }



}
