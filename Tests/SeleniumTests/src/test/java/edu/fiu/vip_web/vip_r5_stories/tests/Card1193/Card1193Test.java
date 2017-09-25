// #####################################################################
// #1193 Extend Lock and Unlock Functionality for semester lock
//
// Description:
// As a User I would like to set a Semester to Inactive so that professors 
// can't propose projects for old semesters.
// 
// Acceptance Criteria:
// Terms collection updated
// When a term is locked, any project from that semester is locked
// Projects cannot be proposed for locked semesters
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1193;

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

public class Card1193Test extends SeleniumTestBase{
    
        final String PROJ_NAME = "BOLO", 
                 ACTIVE = "Active", 
                 DISABLED = "Disabled"; 
     @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1193Test() throws Exception {
        executeSteps(Arrays.asList(
                new AdminLoginStep(getDriver()),
                new ProposeProjectStep(getDriver(), PROJ_NAME),
                new AcceptProjectProposalStep(getDriver()),
                new ToAdminPanelStep(getDriver()),
                new Card1193Step(getDriver(), PROJ_NAME, DISABLED),
                new ToAdminPanelStep(getDriver()),
                new Card1193Step(getDriver(), PROJ_NAME, ACTIVE) 
        ));
    }
    
    @After
    public void teardown() throws Exception {
        try {
            executeSteps(Arrays.asList(
                    new DeleteProjectStep(getDriver(), PROJ_NAME),
                    new LogoffStep(getDriver())
            ));
            
        } finally {
            super.teardown();
        }
    }
}
