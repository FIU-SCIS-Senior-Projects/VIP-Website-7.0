package edu.fiu.vip_web.vip_r5_stories.tests.Card1218;

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import edu.fiu.vip_web.vip_r5_stories.common.step.AdminLoginStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.LogoffStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.RejectProjectProposalStep;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;

/**
 * Created by josep on 5/27/17.
 */
public class Card1218Test extends SeleniumTestBase {

    @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1218Test() throws Exception {
        executeSteps(Arrays.asList(
                new AdminLoginStep(getDriver()),
                new Card1218Step(getDriver())//this submits a proposal but the proposeProjectStep can't be used
        ));
    }

    @After
    public void teardown() throws Exception {
        try {
            executeSteps(Arrays.asList(
                    new RejectProjectProposalStep(getDriver()),
                    new LogoffStep(getDriver())
            ));
        } finally {
            super.teardown();
        }
    }
}
