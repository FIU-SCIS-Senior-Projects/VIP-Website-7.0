package edu.fiu.vip_web.vip_r5_stories.tests.Card1218;

import edu.fiu.vip_web.vip_r5_stories.common.step.ProposeProjectStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.Dialog;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProposeProjectPage;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/27/17.
 */
public class Card1218Step extends SeleniumTestStep {

    public Card1218Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        new ProposeProjectStep(getDriver()).proposeProjectNoSubmit();
        click(ProposeProjectPage.SUBMIT_BUTTON);
        Thread.sleep(1000);
        Assert.assertTrue(isElementPresent(Dialog.CONFIRM_BUTTON));//if it takes more than 1s it's taking too long
        click(Dialog.CONFIRM_BUTTON);
        waitForElementGone(Dialog.CONFIRM_BUTTON);
    }
}
