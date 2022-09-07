package com.cardiff.maplife.config;

import com.twilio.rest.conversations.v1.Role;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@ConfigurationProperties("twilio")
public class TwilioConfig {
    private static final String account_SID = "AC4f1b3c945710a74853766fd59071a9aa";
    private static final String api_key = "SKc71b0b7e0d4d55f484a15a5467de4263";
    private static final String api_secret = "KZ8gLRjbBLQai82qIZUiQdT0MzCy9oeU";
    private static final String token ="32378018f4a80f106e6f4a2727b9066b";
    private static final String chat_service_SID = "IS1beb7d04173e4857a86014b05e50bb0b";
    public TwilioConfig() {
    }

    public String GetSID(){return account_SID;}
    public String GetAPI_Key(){return api_key;}
    public String GetAPI_Secret(){return api_secret;}
    public String GetToken(){return token;}
    public String GetChat(){return chat_service_SID;}

}
