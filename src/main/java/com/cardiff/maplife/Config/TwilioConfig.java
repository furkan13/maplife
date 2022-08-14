package com.cardiff.maplife.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("twilio")
public class TwilioConfig {
    private static final String account_SID = "AC4f1b3c945710a74853766fd59071a9aa";
    private static final String api_key = "SK77d0e7f064cc1a3c5d8fdd73cf1bf22d";
    private static final String api_secret = "OH4sRv0f2d6UXj32ZY8biCI1QNCSnKdx";
    private static final String token ="32378018f4a80f106e6f4a2727b9066b";

    public TwilioConfig() {
    }

    public String GetSID(){return account_SID;}
    public String GetAPI_Key(){return api_key;}
    public String GetAPI_Secret(){return api_secret;}
    public String GetToken(){return token;}

}
