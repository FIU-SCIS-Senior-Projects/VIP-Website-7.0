package edu.fiu.vip_web.vip_r5_stories.tests.Card1215;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.FooterSection;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/27/17.
 */
public class Card1215Step extends SeleniumTestStep {

    public Card1215Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        waitForElement(FooterSection.FOOTER_DIV);
        click(FooterSection.FACEBOOK_LINK);
        waitForUrlToBe("https://www.facebook.com/VIPatFIU");
        getDriver().navigate().back();
        click(FooterSection.YOUTUBE_LINK);
        waitForUrlToBe("https://www.youtube.com/channel/UC0nh97UXjAYf4xZLx-Io2kg");
        getDriver().navigate().back();
    }
}
