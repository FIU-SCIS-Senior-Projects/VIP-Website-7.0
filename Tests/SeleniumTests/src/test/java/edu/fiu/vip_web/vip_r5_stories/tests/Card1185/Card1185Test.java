// #####################################################################
// #1185 Add guideline videos to "Login page"
// 
// Descroption: None
// Acceptance Criteria: None 
// #####################################################################
package edu.fiu.vip_web.vip_r5_stories.tests.Card1185;

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import java.util.Arrays;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author Dafna
 */

public class Card1185Test extends SeleniumTestBase{
    
     @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1185Test() throws Exception {
        
        executeSteps(Arrays.asList(
                new Card1185Step(getDriver())
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
