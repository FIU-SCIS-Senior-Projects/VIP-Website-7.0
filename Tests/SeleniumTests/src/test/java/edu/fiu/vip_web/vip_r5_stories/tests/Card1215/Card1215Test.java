package edu.fiu.vip_web.vip_r5_stories.tests.Card1215;

import edu.fiu.vip_web.vip_r5_stories.common.SeleniumTestBase;
import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;

/**
 * Created by josep on 5/27/17.
 */
public class Card1215Test extends SeleniumTestBase {
    @Before
    public void setup() throws Exception {
        super.setup();
    }

    @Test
    public void card1215Test() throws Exception {
        executeSteps(Arrays.<SeleniumTestStep>asList(
                new Card1215Step(getDriver())
        ));
    }

    @After
    public void teardown() throws Exception {
        super.teardown();
    }
}
