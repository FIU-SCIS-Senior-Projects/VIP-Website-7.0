
// #####################################################################
// #1172 Divide Login page to two parts
//
// Description:
// The login page of the VIP website should have two login sections.
// 1. For Non-FIU students i.e., faculty, admins. For this section it would 
// have a form format with login username and password. 2. For FIU students: 
// We have a google gmail icon, which when clicked would let them login to the
// VIP website, since FIU students have the panther mail linked with gmail.
// Also we have user guide line videos which would help the students/faculty 
// if they have any concerns.
// 
//
// Acceptance Criteria:
// Faculty must be able to login by giving their username and password.
// Students should be able to login by clicking on the Google Icon.
// The user videos must be played when clicked on them.
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1172;

import edu.fiu.vip_web.vip_r5_stories.common.step.AdminLoginStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.LogoffStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.StudentLoginStep;
import org.openqa.selenium.WebDriver;

/**
 *
 * @author Dafna
 */

public class Card1172Step extends SeleniumTestStep {

    
     public Card1172Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        
        new StudentLoginStep(getDriver()).execute();
        new LogoffStep(getDriver()).execute(); 
        new AdminLoginStep(getDriver()).execute(); 
        new LogoffStep(getDriver()).execute();
      
    }
    
}

