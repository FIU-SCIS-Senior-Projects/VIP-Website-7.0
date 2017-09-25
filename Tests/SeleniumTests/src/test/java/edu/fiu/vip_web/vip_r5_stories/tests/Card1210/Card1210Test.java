package edu.fiu.vip_web.vip_r5_stories.tests.Card1210;

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import edu.fiu.vip_web.vip_r5_stories.common.step.AdminLoginStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.DownloadExcelUsersDataStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.LogoffStep;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;

/**
 * Created by josep on 5/27/17.
 */
public class Card1210Test extends SeleniumTestBase {

    @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1210Test() throws Exception {
        executeSteps(Arrays.asList(
                new AdminLoginStep(getDriver()),
                new DownloadExcelUsersDataStep(getDriver()),
                new Card1210Step(getDriver())
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
