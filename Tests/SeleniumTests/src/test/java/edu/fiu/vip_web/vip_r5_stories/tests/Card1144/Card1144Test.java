// #####################################################################
// 1144 - Add skill item in student application form and faculty proposal form
//
// Description:
// As a user, i would like to have a separate text box for skill item so 
// that student can enter the skills that they have and professors can enter
// the skills that project requires.
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1144;

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

public class Card1144Test extends SeleniumTestBase{
    
    private final String PROJECT_NAME = "Test_1144"; 
     @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1144Test() throws Exception {
        
        executeSteps(Arrays.asList(
                new AdminLoginStep(getDriver()), 
                new Card1144Step(getDriver(), PROJECT_NAME)
        )); 
        
    }
    
    @After
    public void teardown() throws Exception {
        try {
            new DeleteProjectStep(getDriver()).execute(PROJECT_NAME);
         new LogoffStep(getDriver()).execute();
            
        } finally {
            super.teardown();
        }
    }
    
}
