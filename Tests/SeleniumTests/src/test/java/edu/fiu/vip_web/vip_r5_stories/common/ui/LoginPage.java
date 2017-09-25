package edu.fiu.vip_web.vip_r5_stories.common.ui;

import org.openqa.selenium.By;

/**
 * Created by josep on 5/26/17.
 */
public class LoginPage {
    public static final By EMAIL_TEXTBOX = By.id("email");
    public static final By PASSWORD_TEXTBOX = By.id("password");
    public static final By LOGIN_BUTTON = By.id("login");
    public static final By GOOGLE_LOGIN_BUTTON = By.xpath("//a[contains(@href, '/auth/google')]");
    public static final By CREATE_ACCOUNT_BUTTON = By.linkText("Create an account");
}
