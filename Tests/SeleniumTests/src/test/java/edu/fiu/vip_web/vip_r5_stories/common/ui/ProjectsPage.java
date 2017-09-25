package edu.fiu.vip_web.vip_r5_stories.common.ui;

import org.openqa.selenium.By;

/**
 * Created by josep on 5/27/17.
 */
public class ProjectsPage {
    public static final By FIRST_PROJECT_LINK = By.xpath("//div[3]/div/h3[2]/a");
    
    public static final By SEARCH_BOX = By.cssSelector("input.form-control"); 
    
    public static final By PROJECT_TITLES = By.cssSelector("a.ng-binding"); 
    
    public static final By PROJECT_CONTAINERS = By.cssSelector("div.col-md-6"); 
}
