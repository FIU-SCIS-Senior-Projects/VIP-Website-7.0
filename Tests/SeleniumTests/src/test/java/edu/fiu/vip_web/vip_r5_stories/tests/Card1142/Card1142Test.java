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

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import edu.fiu.vip_web.vip_r5_stories.common.step.*; 
import java.util.Arrays;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author Dafna
 */

public class Card1142Test extends SeleniumTestBase{
    
    private final String PROJECT_NAME = "Test_1142"; 
    
     @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1142Test() throws Exception {
        executeSteps(Arrays.asList(
                new AdminLoginStep(getDriver()), 
                new Card1142Step(getDriver(), PROJECT_NAME)
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