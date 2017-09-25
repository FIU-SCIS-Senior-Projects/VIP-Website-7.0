package edu.fiu.vip_web.vip_r5_stories.common.ui;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.interactions.Actions;

/**
 * Created by josep on 5/26/17.
 */
public class TopMenu {
    public static final By PROSPECTIVE_STUDENTS_MENU = By.linkText("PROSPECTIVE STUDENTS");
    public static final By FACULTY_MENU = By.linkText("FACULTY");
    public static final By PROJECTS = By.linkText("PROJECTS");

    private static void goTo(WebDriver driver, By menu, By link) {
        new Actions(driver)
                .moveToElement(driver.findElement(menu)).click()
                .moveToElement(driver.findElement(link)).click()
                .build().perform();
    }

    public static class ProspectiveStudents {
        public static final By REVIEW_FACULTY_REGISTRATIONS = By.linkText("REVIEW FACULTY REGISTRATIONS");
        public static final By REVIEW_STUDENT_APPLICATIONS = By.linkText("REVIEW STUDENT APPLICATIONS");

        public static void goToReviewStudentApplications(WebDriver driver) {
            goTo(driver, PROSPECTIVE_STUDENTS_MENU, REVIEW_STUDENT_APPLICATIONS);
        }

        public static void goToReviewFacultyRegistrations(WebDriver driver) {
            goTo(driver, PROSPECTIVE_STUDENTS_MENU, REVIEW_FACULTY_REGISTRATIONS);
        }
    }

    public static class Faculty {
        public static final By REVIEW_PROJECT_PROPOSALS = By.linkText("REVIEW PROJECT PROPOSALS");

        public static void goToReviewProjectProposals(WebDriver driver) {
            goTo(driver, FACULTY_MENU, REVIEW_PROJECT_PROPOSALS);
        }
    }
}
