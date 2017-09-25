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

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import edu.fiu.vip_web.vip_r5_stories.common.step.AdminLoginStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.DeleteProjectStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.LogoffStep;
import java.util.Arrays;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author Dafna
 */

public class Card1152Test extends SeleniumTestBase{
    
     private final String MINGLE_URL = "https://profile.thoughtworks.com/cas/fiu-scis-seniorproject/login?service=https://fiu-scis-seniorproject.mingle.thoughtworks.com/profile/login";
     private final String PROJECT_NAME = "Test_1152"; 
     
     @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1152Test() throws Exception {
        
        executeSteps(Arrays.asList(
                new AdminLoginStep(getDriver()),
                new Card1152Step(getDriver(), PROJECT_NAME, MINGLE_URL)
        )); 
        
    }
    
    @After
    public void teardown() throws Exception {
        try {
            
         toBaseURL();
         new DeleteProjectStep(getDriver()).execute(PROJECT_NAME);
         new LogoffStep(getDriver()).execute();
            
        } finally {
            super.teardown();
        }
    }
}
