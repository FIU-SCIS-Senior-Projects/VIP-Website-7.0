// #####################################################################
// #1152 Mingle Filed and Logo 
//
// Description:
// As a user, I would like a link to my project’s mingle
// 
// Acceptance Criteria:
// In the “Project Proposal Form” a field for entering a Mingle Link exists
// If added, in the project approval page, there will be a social icon link to the project Mingle
// When the icon is clicked, the user will be redirected to the link bound to it.
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1152;

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

public class Card1152Step extends SeleniumTestStep {

    private String mingleURL; 
    private String project; 
    
     public Card1152Step(WebDriver driver, String projName, String url) {
        super(driver);
        
        project = projName; 
        mingleURL = url; 
    }

    @Override
    public void execute() throws Exception {
      
        ProposeProjectStep pps = new ProposeProjectStep(getDriver(), project); 
        
        pps.proposeProjectNoSubmit();
        addMingle();  
        pps.submit();
        
        new AcceptProjectProposalStep(getDriver()).execute();
        checkMingle();  
    }
    
    private void addMingle() throws Exception
    {
        type(ProposeProjectPage.MINGLE_LINK_TEXTBOX, mingleURL); 
    }
    
    private void checkMingle() throws Exception
    {
        new ToSpecificProjectStep(getDriver()).execute(project); 
        
        Assert.assertTrue("Mingle link does not appear on project page.", 
                super.isElementPresent(ProjectDetailsPage.MINGLE_LINK));
        
        click(ProjectDetailsPage.MINGLE_LINK); 
        super.waitForElementGone(ProjectDetailsPage.MINGLE_LINK);
        
        String currentURL = getDriver().getCurrentUrl().toLowerCase();
        Assert.assertTrue("Mingle link does not lead to the correct URL", currentURL.equals(mingleURL.toLowerCase()));
    }
    
}
