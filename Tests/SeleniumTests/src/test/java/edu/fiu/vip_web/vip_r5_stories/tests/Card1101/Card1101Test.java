
// #####################################################################
// #1101 Add lock and unlock for projects in the teams page 
// 
//  Description:
//  As a PI of the website I would like to be able to:
//  - lock&unlock the project for now(so nobody can apply),
//  - Move the fall semester projects to the fall folder and 
//  - when new faculties apply for a project they can’t apply 
// for the fall any more and their new proposed projects goes to the spring 
// folder
// 
//  Acceptance Criteria:
//  Archives should be still available with a link or logo from new similar 
//  projects (PI add them manually like GitHub or Mingle link)
//  if it’s possible lock should be one for whole semester. and another way for
//  a specific project.
//  Pi must be enable to set and change
//  taking care of teams page application form
//  taking care of join buttons in the team page
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1101;
import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import edu.fiu.vip_web.vip_r5_stories.common.step.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import java.util.Arrays;

/**
 *
 * @author Dafna
 */

public class Card1101Test extends SeleniumTestBase{
    
     final String PROJ_NAME = "BOLO", 
               ACTIVE = "Active", 
               DISABLED = "Disabled"; 
     
     @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1101Test() throws Exception {
        
        executeSteps(Arrays.asList(
                new AdminLoginStep(getDriver()),
                new ProposeProjectStep(getDriver(), PROJ_NAME),
                new AcceptProjectProposalStep(getDriver()),
                new ToAdminPanelStep(getDriver()),
                new Card1101Step(getDriver(), PROJ_NAME, DISABLED),
                new ToAdminPanelStep(getDriver()),
                new Card1101Step(getDriver(), PROJ_NAME, ACTIVE)   
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
