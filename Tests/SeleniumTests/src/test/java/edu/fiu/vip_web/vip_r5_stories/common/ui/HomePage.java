package edu.fiu.vip_web.vip_r5_stories.common.ui;

import org.openqa.selenium.By;

/**
 * Created by josep on 5/26/17.
 */
public class HomePage {
    public static final By LOGIN_BUTTON = By.xpath("//button[@type='button' and text()='Log In']");
    public static final By LOGOFF_BUTTON = By.xpath("//button[@type='button' and text()='Log Out']");
    public static final By APPLY_FOR_PROJECT = By.cssSelector("div.panel.panel-default > button.btn.btn-primary");
    public static final By PROPOSE_PROJECT = By.xpath("//div[2]/button");
    public static final By ADMIN_PANEL_BUTTON = By.cssSelector("i.fa.fa-wrench");
}
