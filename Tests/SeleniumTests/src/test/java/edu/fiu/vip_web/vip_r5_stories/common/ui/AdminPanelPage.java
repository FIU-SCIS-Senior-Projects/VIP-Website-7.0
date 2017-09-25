package edu.fiu.vip_web.vip_r5_stories.common.ui;

import org.openqa.selenium.By;

/**
 * Created by josep on 5/27/17.
 */
public class AdminPanelPage {
    public static final By DOWNLOAD_EXCEL_BUTTON = By.xpath("//li[3]/button");

    public static final By GENDER_FILTER_TEXTBOX = By.xpath("(//input[@type='text'])[8]");
    public static final By EMAIL_FILTER_TEXTBOX = By.xpath("(//input[@type='text'])[3]");

    public static final String XPATH_FIRST_NAME_FIELD_FORMAT = "//table[1]/tbody/tr[%d]/td[2]";

    public static final String XPATH_PROJECT_APPLICATION_DATE_FIELD_FORMAT = "//tbody/tr[%d]/td[15]";
    public static final String XPATH_USER_REGISTRATION_DATE_FIELD_FORMAT = "//tbody/tr[%d]/td[16]";
    public static final String XPATH_FIRST_LOGIN_DATE_FIELD_FORMAT = "//tbody/tr[%d]/td[17]";

    public static final By FIRST_LOGIN_DATE_FIELD_FIRST = By.xpath("//tbody/tr[1]/td[17]");

    public static final By PROJECT_APPLICATION_DATE_LABEL = By.xpath("//th[15]");
    public static final By USER_REGISTRATION_DATE_LABEL = By.xpath("//th[16]");
    public static final By FIRST_LOGIN_DATE_LABEL = By.xpath("//th[17]");
    
    // ADDED BY DAFNA 
    
    public static final By LOCK_PROJ_PROJECT_COMBOBOX = By.xpath("//div[1]/div/div/div[4]/div[1]/div/table[1]/tbody/tr[1]/th/select"); 
    public static final By LOCK_PROJ_STATUS_COMBOBOX = By.xpath("//div[1]/div/div/div[4]/div[1]/div/table[1]/tbody/tr[3]/th/select"); 
    public static final By LOCK_PROJ_BUTTON = By.xpath("//div[1]/div/div/div[4]/div[1]/div/table[2]/tbody/tr/th[1]/button"); 
    
    
    public static final By LOCK_SEM_SEMESTER_COMBOBOX = By.xpath("//div[1]/div/div/div[4]/div[2]/div/table[1]/tbody/tr[1]/th/select"); 
    public static final By LOCK_SEM_STATUS_COMBOBOX = By.xpath("//div[1]/div/div/div[4]/div[2]/div/table[1]/tbody/tr[3]/th/select"); 
    public static final By LOCK_SEM_BUTTON = By.xpath("//div[1]/div/div/div[4]/div[2]/div/table[2]/tbody/tr/th[1]/button"); 
}
