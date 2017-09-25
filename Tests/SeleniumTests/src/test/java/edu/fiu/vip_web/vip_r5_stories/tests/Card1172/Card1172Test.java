
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

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import java.util.Arrays;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author Dafna
 */

public class Card1172Test extends SeleniumTestBase{
    
     @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1172Test() throws Exception {
        
        executeSteps(Arrays.asList(
                new Card1172Step(getDriver())
        )); 
        
    }
    
    @After
    public void teardown() throws Exception {
        try {
            // nothing to tear down 
            
        } finally {
            super.teardown();
        }
    }
    
}

