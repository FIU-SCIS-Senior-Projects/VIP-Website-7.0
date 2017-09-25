package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.Dialog;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ReviewUserPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.TopMenu;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/27/17.
 */
public class RejectStudentApplicationStep extends SeleniumTestStep {

    public RejectStudentApplicationStep(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        waitForElement(TopMenu.PROSPECTIVE_STUDENTS_MENU);
        TopMenu.ProspectiveStudents.goToReviewStudentApplications(getDriver());
        waitForUrlToBe(getTestData().getBaseUrl() + "reviewuser");
        click(ReviewUserPage.REJECT_FIRST_USER_BUTTON);
        click(Dialog.CONFIRM_BUTTON);
    }
}
