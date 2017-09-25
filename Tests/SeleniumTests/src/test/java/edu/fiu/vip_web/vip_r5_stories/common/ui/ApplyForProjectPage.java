package edu.fiu.vip_web.vip_r5_stories.common.ui;

import org.openqa.selenium.By;

/**
 * Created by josep on 5/26/17.
 */
public class ApplyForProjectPage {
    public static final By PROJECT_SELECT = By.xpath("//form/div/table/tbody/tr[1]/td/select");
    public static final By PROJECT_SELECT_SECOND_OPTION = By.xpath("//form/div/table/tbody/tr[1]/td/select/option[2]");

    public static final By SEMESTER_SELECT = By.xpath("//form/div/table/tbody/tr[2]/td/select");
    public static final By SEMESTER_SELECT_SECOND_OPTION = By.xpath("//form/div/table/tbody/tr[2]/td/select/option[2]");

    public static final By RANK_SELECT = By.xpath("//form/div/table/tbody/tr[5]/td[2]/div/select");
    public static final By RANK_SELECT_SECOND_OPTION = By.xpath("//form/div/table/tbody/tr[5]/td[2]/div/select/option[2]");

    public static final By PID_TEXTBOX = By.xpath("//form/div/table/tbody/tr[6]/td[1]/div/input");

    public static final By GENDER_SELECT = By.xpath("//form/div/table/tbody/tr[6]/td[2]/div/select");
    public static final By GENDER_SELECT_SECOND_OPTION = By.xpath("//form/div/table/tbody/tr[6]/td[2]/div/select/option[1]");

    public static final By REASON_SELECT = By.xpath("//form/div/table/tbody/tr[7]/td/select");
    public static final By REASON_SELECT_THIRD_OPTION = By.xpath("//form/div/table/tbody/tr[7]/td/select/option[3]");

    public static final By COLLEGE_SELECT = By.xpath("//form/div/table/tbody/tr[8]/td/select");
    public static final By COLLEGE_SELECT_SECOND_OPTION = By.xpath("//form/div/table/tbody/tr[8]/td/select/option[2]");

    public static final By DEPARTMENT_SELECT = By.xpath("//form/div/table/tbody/tr[9]/td/select");
    public static final By DEPARTMENT_SELECT_SECOND_OPTION = By.xpath("//form/div/table/tbody/tr[9]/td/select/option[2]");

    public static final By EXPERIENCE_TEXTBOX = By.xpath("//form/div/table/tbody/tr[10]/td/skills/div/textarea");

    public static final By SUBMIT_BUTTON = By.xpath("//form/div/div[1]/input");
}
