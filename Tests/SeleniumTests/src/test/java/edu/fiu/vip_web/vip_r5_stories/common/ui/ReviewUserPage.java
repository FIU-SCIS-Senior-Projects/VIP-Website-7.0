package edu.fiu.vip_web.vip_r5_stories.common.ui;

import org.openqa.selenium.By;

/**
 * Created by josep on 5/27/17.
 */
public class ReviewUserPage {
    public static final By REJECT_FIRST_USER_BUTTON = By.xpath("//table[1]/tbody/tr[2]/td[12]/div/button");
    public static final String XPATH_STUDENT_APPLICATION_DATE_TEXTBOX_FORMAT = "//table[1]/tbody/tr[%d]/td[1]/a/input";
}
