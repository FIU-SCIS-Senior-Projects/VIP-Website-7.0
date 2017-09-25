package edu.fiu.vip_web.vip_r5_stories.common.ui;

import org.openqa.selenium.By;

/**
 * Created by josep on 5/29/17.
 */
public class FacultyRegistrationPage {
    public static final By FIRST_NAME_TEXTBOX = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[1]/td[1]/input");
    public static final By LAST_NAME_TEXTBOX = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[1]/td[2]/input");
    public static final By EMAIL_TEXTBOX = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[2]/td[1]/input");
    public static final By PASSWORD_TEXTBOX = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[3]/td[1]/input");
    public static final By CONFIRM_PASSWORD_TEXTBOX = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[4]/td[1]/input");

    public static final By USER_TYPE_SELECT = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[5]/td[1]/div/select");
    public static final By USER_TYPE_SELECT_SECOND_OPTION = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[5]/td[1]/div/select/option[2]");

    public static final By RANK_SELECT = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[5]/td[2]/div/select");
    public static final By RANK_SELECT_SECOND_OPTION = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[5]/td[2]/div/select/option[2]");

    public static final By PID_TEXTBOX = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[6]/td[1]/div/input");

    public static final By GENDER_SELECT = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[6]/td[2]/div/select");
    public static final By GENDER_SELECT_THIRD_OPTION = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[6]/td[2]/div/select/option[3]");

    public static final By COLLEGE_SELECT = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[7]/td[1]/select");
    public static final By COLLEGE_SELECT_SECOND_OPTION = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[7]/td[1]/select/option[2]");

    public static final By DEPARTMENT_SELECT = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[8]/td[1]/select");
    public static final By DEPARTMENT_SELECT_SECOND_OPTION = By.xpath("//form[1]/div[1]/table[1]/tbody/tr[8]/td[1]/select/option[2]");

    public static final By SUBMIT_BUTTON = By.xpath("//button[@type='submit']");
}
