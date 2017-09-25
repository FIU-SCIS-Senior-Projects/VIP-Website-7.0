package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.Dialog;
import edu.fiu.vip_web.vip_r5_stories.common.ui.HomePage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProposeProjectPage;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/27/17.
 */
public class ProposeProjectStep extends SeleniumTestStep {

    private String project = "The invincibles"; 
    public ProposeProjectStep(WebDriver driver) {
        super(driver);
    }
    
    public ProposeProjectStep(WebDriver driver, String proj)
    {
        super(driver);
        project = proj; 
    }
    
    public void proposeProjectNoSubmit() throws InterruptedException {
        click(HomePage.PROPOSE_PROJECT);
        type(ProposeProjectPage.TEAM_TITLE_TEXTBOX, project);
        select(ProposeProjectPage.SEMESTER_SELECT, "Fall 2017");
        click(ProposeProjectPage.TEAM_DESCRIPTION_BULLET_BUTTON);
        type(ProposeProjectPage.SKILLS_TEXTBOX, "absolutely none");
    }

    @Override
    public void execute() throws Exception {
        proposeProjectNoSubmit();
        submit(); 
    }
    
    public void submit() throws Exception 
    {
        click(ProposeProjectPage.SUBMIT_BUTTON);
        click(Dialog.CONFIRM_BUTTON);
        waitForElementGone(Dialog.CONFIRM_BUTTON);
    }
}
