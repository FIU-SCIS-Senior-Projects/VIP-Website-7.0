// #####################################################################
// 1144 - Add skill item in student application form and faculty proposal form
//
// Description:
// As a user, i would like to have a separate text box for skill item so 
// that student can enter the skills that they have and professors can enter
// the skills that project requires.
// ###################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1144;

import edu.fiu.vip_web.vip_r5_stories.common.step.AcceptProjectProposalStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.ProposeProjectStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.ToSpecificProjectStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProjectDetailsPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProposeProjectPage;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;

/**
 *
 * @author Dafna
 */

public class Card1144Step extends SeleniumTestStep {

    private String project;
    private final String CUSTOM_SKILL = "SKILL_1144"; 
    
     public Card1144Step(WebDriver driver, String projName) {
        super(driver);
        project = projName; 
    }

    @Override
    public void execute() throws Exception {
        
         ProposeProjectStep pps = new ProposeProjectStep(getDriver(), project); 
        
        pps.proposeProjectNoSubmit();
        addSkill(); 
        pps.submit();
        
        new AcceptProjectProposalStep(getDriver()).execute();
        checkSkill(); 
      
    }
    
    private void addSkill() throws Exception
    {
        type(ProposeProjectPage.SKILLS_TEXTBOX, CUSTOM_SKILL); 
    }
    
    private void checkSkill() throws Exception
    {
        new ToSpecificProjectStep(getDriver()).execute(project); 
               waitForElement(ProjectDetailsPage.SKILLS_DESCRIPTION); 
        
        String projSkill = getDriver().findElement(ProjectDetailsPage.SKILLS_DESCRIPTION).getText();
        
        Assert.assertTrue("Project skill does not match form input.", projSkill.contains(CUSTOM_SKILL));
    }
    
    
}

