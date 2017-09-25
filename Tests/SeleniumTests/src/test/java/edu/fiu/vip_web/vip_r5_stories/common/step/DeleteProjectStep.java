
package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.Dialog;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProjectDetailsPage;
import org.openqa.selenium.WebDriver;

/**
 *
 * @author Dafna
 */
public class DeleteProjectStep extends SeleniumTestStep {
    private String projectName = "The invincibles";

    public DeleteProjectStep(WebDriver driver) {
        super(driver);
    }
    public DeleteProjectStep(WebDriver driver, String projectName) {
        super(driver);
        this.projectName = projectName;
    }

    
    @Override
    public void execute() throws Exception
    {
        execute(projectName);
    }
    
    public void execute(String projectName) throws Exception {
        
        new ToSpecificProjectStep(getDriver()).execute(projectName);
        
        click(ProjectDetailsPage.DELETE_BUTTON);

        click(Dialog.CONFIRM_BUTTON); 
        waitForElementGone(Dialog.CONFIRM_BUTTON); 
    }

}
