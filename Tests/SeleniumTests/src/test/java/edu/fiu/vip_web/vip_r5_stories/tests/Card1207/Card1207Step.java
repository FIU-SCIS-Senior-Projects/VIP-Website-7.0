package edu.fiu.vip_web.vip_r5_stories.tests.Card1207;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ReviewFacultyRegistrationsPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.TopMenu;
import org.junit.*;
import org.openqa.selenium.*;

public class Card1207Step extends SeleniumTestStep {

  public Card1207Step(WebDriver driver) {
    super(driver);
  }

  @Override
  public void execute() throws Exception {
    waitForElement(TopMenu.PROSPECTIVE_STUDENTS_MENU);
    TopMenu.ProspectiveStudents.goToReviewFacultyRegistrations(getDriver());
    waitForElement(By.xpath(ReviewFacultyRegistrationsPage.XPATH_APPROVE_REGISTRATION_BUTTON_FIRST));
    boolean dateFound = checkDateFound(ReviewFacultyRegistrationsPage.XPATH_REVIEW_FACULTY_REGISTRATIONS_DATE_FORMAT, 2,
            element -> element.getAttribute("value"));
    Assert.assertTrue(dateFound);
  }
}
