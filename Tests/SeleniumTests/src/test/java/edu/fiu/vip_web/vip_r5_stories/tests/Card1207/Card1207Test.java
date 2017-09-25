package edu.fiu.vip_web.vip_r5_stories.tests.Card1207;

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import edu.fiu.vip_web.vip_r5_stories.common.step.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;

public class Card1207Test extends SeleniumTestBase {

    @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1207Test() throws Exception {
        executeSteps(Arrays.asList(
                new CreateFacultyAccountStep(getDriver()),
                new AdminLoginStep(getDriver()),
                new Card1207Step(getDriver())
        ));
    }

    @After
    public void teardown() throws Exception {
        try {
            executeSteps(Arrays.asList(
                    new RejectFacultyAccountStep(getDriver(), "firstName"),
                    new LogoffStep(getDriver())
            ));

        } finally {
            super.teardown();
        }
    }

}
