package edu.fiu.vip_web.vip_r5_stories.tests.Card1217;

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import edu.fiu.vip_web.vip_r5_stories.common.step.AdminLoginStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.LogoffStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.StudentLoginStep;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;

/**
 * Created by josep on 5/27/17.
 */
public class Card1217Test extends SeleniumTestBase {

    @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1217Test() throws Exception {
        executeSteps(Arrays.asList(
                new StudentLoginStep(getDriver()),
                new LogoffStep(getDriver()),
                new AdminLoginStep(getDriver()),
                new Card1217Step(getDriver())
        ));
    }

    @After
    public void teardown() throws Exception {
        try {
            new LogoffStep(getDriver()).execute();
        } finally {
            super.teardown();
        }
    }
}
