package edu.fiu.vip_web.vip_r5_stories.tests.Card1206;

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import edu.fiu.vip_web.vip_r5_stories.common.step.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;

/**
 * Created by josep on 5/29/17.
 */
public class Card1206Test extends SeleniumTestBase {

    @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1206Test() throws Exception {
        executeSteps(Arrays.asList(
                new AdminLoginStep(getDriver()),
                new ProposeProjectStep(getDriver()),
                new AcceptProjectProposalStep(getDriver()),
                new LogoffStep(getDriver()),
                new StudentLoginStep(getDriver()),//so that the first login date is populated
                new ApplyForProjectStep(getDriver()),//so that project application date is populated
                new LogoffStep(getDriver()),
                new AdminLoginStep(getDriver()),
                new ProposeProjectStep(getDriver()),
                new DownloadExcelUsersDataStep(getDriver()),
                new Card1206Step(getDriver())
        ));
    }
    @After
    public void teardown() throws Exception {
        try {
            new RejectProjectProposalStep(getDriver()).execute();
            new RejectStudentApplicationStep(getDriver()).execute();
            new LogoffStep(getDriver()).execute();
        } finally {
            super.teardown();
        }
    }
}
