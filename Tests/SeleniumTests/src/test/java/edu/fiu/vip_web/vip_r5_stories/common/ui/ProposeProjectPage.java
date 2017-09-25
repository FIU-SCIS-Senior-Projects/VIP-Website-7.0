package edu.fiu.vip_web.vip_r5_stories.common.ui;

import org.openqa.selenium.By;

/**
 * Created by josep on 5/27/17.
 */
public class ProposeProjectPage {
    public static final By SUBMIT_BUTTON = By.xpath("//input[@type='submit']");
    public static final By TEAM_TITLE_TEXTBOX = By.xpath("//input[@type='text']");

    public static final By SEMESTER_SELECT = By.xpath("//select[@value='selectedTerm']");
    public static final By SEMESTER_SECOND_OPTION = By.xpath("//select[@value='selectedTerm']/option[2]");

    public static final By TEAM_DESCRIPTION_BULLET_BUTTON = By.xpath("(//button[@type='button'])[11]");
    public static final By SKILLS_TEXTBOX = By.xpath("//skills/div/textarea");
    
    // ADDED BY DAFNA 
    
    public static final By MINGLE_LINK_TEXTBOX = By.xpath("//div[1]/div/div/form/div[14]/input"); 
    public static final By DESCRIPTION_TEXTBOX = By.xpath("//div/div/div/form/div[7]/trix-editor"); 
}
