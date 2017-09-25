package edu.fiu.vip_web.vip_r5_stories.tests.Card1209;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ReviewProjectProposalPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.TopMenu;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/27/17.
 */
public class Card1209Step extends SeleniumTestStep {

    public Card1209Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        waitForElement(TopMenu.FACULTY_MENU);
        TopMenu.Faculty.goToReviewProjectProposals(getDriver());
        waitForElement(ReviewProjectProposalPage.PROJECT_PROPOSAL_DATE_LABEL);
        Assert.assertTrue(
                getDriver().findElement(ReviewProjectProposalPage.PROJECT_PROPOSAL_DATE_LABEL).getText().equals("Date"));
        boolean dateFound = checkDateFound(ReviewProjectProposalPage.XPATH_REVIEW_PROJECT_PROPOSAL_DATE_FORMAT, 2,
                element -> element.getAttribute("value"));
        Assert.assertTrue("Date not found or has incorrect format.", dateFound);
    }
}
