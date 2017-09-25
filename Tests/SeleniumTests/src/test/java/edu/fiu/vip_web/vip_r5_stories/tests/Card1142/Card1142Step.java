// #####################################################################
// #1142 Add format to "PROJECT PROPOSAL FORM" 's team description
// 
// Description:
// As a user, I would like to view the description of project in the same format
// as the professor has entered so that it would be easy to understand.
// 
// Acceptance Criteria:
// When a professor enters the description for the project the format should be
// kept same after the proposal.
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1142;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.*;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProjectDetailsPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProposeProjectPage;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;

/**
 *
 * @author Dafna
 */

public class Card1142Step extends SeleniumTestStep {

     private String project; 
     private final String CUSTOM_DESCRIPTION = "Aa Bb Card 1142 Story"; 
     
     public Card1142Step(WebDriver driver, String projName) {
        super(driver);
        project = projName; 
    }

    @Override
    public void execute() throws Exception {
        
        ProposeProjectStep pps = new ProposeProjectStep(getDriver(), project); 
        
        pps.proposeProjectNoSubmit();
        addDescription(); 
        pps.submit();
        
        new AcceptProjectProposalStep(getDriver()).execute();
        checkDescription(); 
        
    }
    
    private void addDescription() throws Exception
    {
        type(ProposeProjectPage.DESCRIPTION_TEXTBOX, "\n"+CUSTOM_DESCRIPTION); 
        click(ProposeProjectPage.DESCRIPTION_TEXTBOX);
        Thread.sleep(2000);
        click(ProposeProjectPage.TEAM_DESCRIPTION_BULLET_BUTTON);
    }
    
    private void checkDescription() throws Exception 
    {
        new ToSpecificProjectStep(getDriver()).execute(project);
        waitForElement(ProjectDetailsPage.PROJECT_DESCRIPTION); 
        
        String projDesc = getDriver().findElement(ProjectDetailsPage.PROJECT_DESCRIPTION).getText();
        
        Assert.assertTrue("Project description was not saved properly.", projDesc.contains(CUSTOM_DESCRIPTION));
    }
    
}
