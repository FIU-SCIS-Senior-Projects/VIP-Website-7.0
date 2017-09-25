package edu.fiu.vip_web.vip_r5_stories.tests.Card1208;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ReviewUserPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.TopMenu;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/26/17.
 */
public class Card1208Step extends SeleniumTestStep {

    public Card1208Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        waitForElement(TopMenu.PROSPECTIVE_STUDENTS_MENU);
        TopMenu.ProspectiveStudents.goToReviewStudentApplications(getDriver());

        waitForElement(ReviewUserPage.REJECT_FIRST_USER_BUTTON);
        boolean dateFound = checkDateFound(ReviewUserPage.XPATH_STUDENT_APPLICATION_DATE_TEXTBOX_FORMAT, 2,
                element -> element.getAttribute("value"));
        Assert.assertTrue(dateFound);
    }
}
