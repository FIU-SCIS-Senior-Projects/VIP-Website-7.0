package edu.fiu.vip_web.vip_r5_stories.common.ui;

import org.openqa.selenium.By;

/**
 * Created by josep on 5/27/17.
 */
public class ProjectDetailsPage {
    public static final By PROJECT_NAME_HEADER = By.xpath("//h2[@class='proj-title-teams']/strong");
    
    // ADDED BY DAFNA 
    public static final By JOIN_BUTTON = By.xpath("//div/div/div/div[3]/div[2]/div[3]"); 
    public static final By EDIT_BUTTON = By.xpath("//div/div/div/div[3]/div[2]/div[4]"); 
    public static final By DELETE_BUTTON = By.xpath("//div/div/div/div[3]/div[2]/div[5]"); 
    
    public static final By SKILLS_DESCRIPTION = By.xpath("//div/div/div/div[2]/div/p[1]"); 
    public static final By PROJECT_DESCRIPTION = By.xpath("//pre[@class='proj-description']"); 
    
    public static final By MINGLE_LINK = By.xpath("//div/div/div/div[3]/div[1]/a[4]/i"); 
}

