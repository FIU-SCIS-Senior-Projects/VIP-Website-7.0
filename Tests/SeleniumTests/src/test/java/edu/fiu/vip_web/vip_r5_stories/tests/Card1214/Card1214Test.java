package edu.fiu.vip_web.vip_r5_stories.tests.Card1214;

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import edu.fiu.vip_web.vip_r5_stories.common.step.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;

/**
 * Created by josep on 5/27/17.
 */
public class Card1214Test extends SeleniumTestBase {

    @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1214Test() throws Exception {
        executeSteps(Arrays.asList(
                new AdminLoginStep(getDriver()),
                new ProposeProjectStep(getDriver()),
                new AcceptProjectProposalStep(getDriver()),
                new Card1214Step(getDriver())
        ));
    }

    @After
    public void teardown() throws Exception {
        try {
            executeSteps(Arrays.asList(
                    new DeleteProjectStep(getDriver()),
                    new LogoffStep(getDriver())
            ));
        } finally {
            super.teardown();
        }
    }
}
