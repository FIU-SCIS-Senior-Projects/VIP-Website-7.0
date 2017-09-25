package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.ApplyForProjectPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.Dialog;
import edu.fiu.vip_web.vip_r5_stories.common.ui.HomePage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.TopMenu;

import org.openqa.selenium.*;

public class ApplyForProjectStep extends SeleniumTestStep {

    public ApplyForProjectStep(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        click(TopMenu.PROJECTS);
        getDriver().findElement(HomePage.APPLY_FOR_PROJECT).click();

        String project = select(ApplyForProjectPage.PROJECT_SELECT, ApplyForProjectPage.PROJECT_SELECT_SECOND_OPTION);
        String semester = select(ApplyForProjectPage.SEMESTER_SELECT, ApplyForProjectPage.SEMESTER_SELECT_SECOND_OPTION);
        String rank = select(ApplyForProjectPage.RANK_SELECT, ApplyForProjectPage.RANK_SELECT_SECOND_OPTION);

        type(ApplyForProjectPage.PID_TEXTBOX, "5325585");

        String gender = select(ApplyForProjectPage.GENDER_SELECT, ApplyForProjectPage.GENDER_SELECT_SECOND_OPTION);
        String reason = select(ApplyForProjectPage.REASON_SELECT, ApplyForProjectPage.REASON_SELECT_THIRD_OPTION);
        String college = select(ApplyForProjectPage.COLLEGE_SELECT, ApplyForProjectPage.COLLEGE_SELECT_SECOND_OPTION);
        String department = select(ApplyForProjectPage.DEPARTMENT_SELECT, ApplyForProjectPage.DEPARTMENT_SELECT_SECOND_OPTION);

        type(ApplyForProjectPage.EXPERIENCE_TEXTBOX, "absolutely none");

        click(ApplyForProjectPage.SUBMIT_BUTTON);
        click(Dialog.CONFIRM_BUTTON);
        waitForElementGone(Dialog.CONFIRM_BUTTON);
    }
}
