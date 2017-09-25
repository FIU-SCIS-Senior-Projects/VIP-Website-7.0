package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.Dialog;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ReviewFacultyRegistrationsPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.TopMenu;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

import java.util.Calendar;
import java.util.GregorianCalendar;

/**
 * Created by josep on 5/29/17.
 */
public class RejectFacultyAccountStep extends SeleniumTestStep {
    private String firstName;

    public RejectFacultyAccountStep(WebDriver driver, String firstName) {
        super(driver);
        this.firstName = firstName;
    }

    @Override
    public void execute() throws Exception {
        waitForElement(TopMenu.PROSPECTIVE_STUDENTS_MENU);
        TopMenu.ProspectiveStudents.goToReviewFacultyRegistrations(getDriver());
        findAndReject();
        assertFacultyDeleted();
    }

    private void assertFacultyDeleted() {
        int index = findIndexByFormatAndValue(ReviewFacultyRegistrationsPage.XPATH_REVIEW_FACULTY_REGISTRATIONS_FIRST_NAME_FORMAT,
                2, element -> element.getAttribute("value"), firstName);
        Assert.assertTrue("Faculty was not deleted even though we hit the reject button. This is a bug that was supposed to be fixed in V6"
                , index == -1);
    }

    private void findAndReject() throws InterruptedException {
        waitForElement(By.xpath(ReviewFacultyRegistrationsPage.XPATH_APPROVE_REGISTRATION_BUTTON_FIRST));
        int index = findIndexByFormatAndValue(ReviewFacultyRegistrationsPage.XPATH_REVIEW_FACULTY_REGISTRATIONS_FIRST_NAME_FORMAT,
                2, element -> element.getAttribute("value"), firstName);
        Assert.assertTrue(index != -1);
        click(By.xpath(String.format(ReviewFacultyRegistrationsPage.XPATH_REJECT_REGISTRATION_BUTTON_FORMAT, index)));
        click(Dialog.CONFIRM_BUTTON);
        waitForElementGone(Dialog.CONFIRM_BUTTON);
    }
}
