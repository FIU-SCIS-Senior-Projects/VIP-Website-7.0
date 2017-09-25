
// #####################################################################
// #1195 Add a search Box in VIP projects page
//
// Description:
// As a user I would like to have a Search box which would let me search for
// the projects easily.
//
// Acceptance Criteria:
// When any word is entered the respective project should be displayed.
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1195;

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import java.util.Arrays;

import edu.fiu.vip_web.vip_r5_stories.common.step.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author Dafna
 */

public class Card1195Test extends SeleniumTestBase{

    private final String PROJ_NAME = "Test";
    
    @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1195Test() throws Exception {
        executeSteps(Arrays.asList(
                new AdminLoginStep(getDriver()),
                new ProposeProjectStep(getDriver(), PROJ_NAME),
                new AcceptProjectProposalStep(getDriver()),
                new LogoffStep(getDriver()),
                new Card1195Step(getDriver(), PROJ_NAME)
        ));
    }
    
    @After
    public void teardown() throws Exception {
        try {
            executeSteps(Arrays.asList(
                    new AdminLoginStep(getDriver()),
                    new DeleteProjectStep(getDriver(), PROJ_NAME),
                    new LogoffStep(getDriver())
            ));
        } finally {
            super.teardown();
        }
    }
}
    
