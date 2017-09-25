// #####################################################################
// #1193 Extend Lock and Unlock Functionality for semester lock
//
// Description:
// As a User I would like to set a Semester to Inactive so that professors 
// can't propose projects for old semesters.
// 
// Acceptance Criteria:
// Terms collection updated
// When a term is locked, any project from that semester is locked
// Projects cannot be proposed for locked semesters
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1193;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.ToSpecificProjectStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.AdminPanelPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.Dialog;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProjectDetailsPage;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * @author Dafna
 */

public class Card1193Step extends SeleniumTestStep {

    private String status, project;
    private String semester = "Fall 2017";

    public Card1193Step(WebDriver driver, String pr, String stat) {
        super(driver);
        status = stat;
        project = pr;
    }

    @Override
    public void execute() throws Exception {
        changeStatus();
        checkStatus();
        Thread.sleep(1000);
    }

    private void changeStatus() throws Exception {
        select(AdminPanelPage.LOCK_SEM_SEMESTER_COMBOBOX, semester);
        select(AdminPanelPage.LOCK_SEM_STATUS_COMBOBOX, status);
        click(AdminPanelPage.LOCK_SEM_BUTTON);

        waitForElement(Dialog.CONFIRM_BUTTON);
        click(Dialog.CONFIRM_BUTTON);
        waitForElementGone(Dialog.CONFIRM_BUTTON);
    }

    private void checkStatus() throws Exception {
        new ToSpecificProjectStep(getDriver()).execute(project);
        click(ProjectDetailsPage.JOIN_BUTTON);

        if ("Active".equals(status)) {
            try {
                waitForElement(By.xpath("//div[@class='container']//h3[.=' Confirm Information ']"));
            } catch (InterruptedException e) {
                Assert.fail("Semester " + semester + "was not activated.");
            }
        }
        if ("Disabled".equals(status)) {
            try {
                waitForElement(Dialog.CONFIRM_BUTTON);
                click(Dialog.CONFIRM_BUTTON);
            } catch (InterruptedException e) {
                Assert.fail("Semester " + semester + "was not disabled.");
            }
        }
    }


}
