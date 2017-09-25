package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.Dialog;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ReviewProjectProposalPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.TopMenu;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/27/17.
 */
public class RejectProjectProposalStep extends SeleniumTestStep {

    public RejectProjectProposalStep(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        waitForElement(TopMenu.FACULTY_MENU);
        TopMenu.Faculty.goToReviewProjectProposals(getDriver());
        findAndReject();
    }

    private void findAndReject() throws InterruptedException {
        waitForElement(By.xpath(String.format(ReviewProjectProposalPage.XPATH_REVIEW_PROJECT_PROPOSAL_DATE_FORMAT, 2)));
        int index = findTodaysIndexByFormat(ReviewProjectProposalPage.XPATH_REVIEW_PROJECT_PROPOSAL_DATE_FORMAT, 2);
        Assert.assertTrue("Proposal not found", index != -1);
        click(By.xpath(String.format(ReviewProjectProposalPage.XPATH_REJECT_PROPOSAL_BUTTON_FORMAT, index)));
        click(Dialog.CONFIRM_BUTTON);
        waitForElementGone(Dialog.CONFIRM_BUTTON);
    }
}
