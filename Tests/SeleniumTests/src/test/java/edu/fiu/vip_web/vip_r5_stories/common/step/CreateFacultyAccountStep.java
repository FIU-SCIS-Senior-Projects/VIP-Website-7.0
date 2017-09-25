package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.*;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/29/17.
 */
public class CreateFacultyAccountStep extends SeleniumTestStep {
    public CreateFacultyAccountStep(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        click(HomePage.LOGIN_BUTTON);
        click(LoginPage.CREATE_ACCOUNT_BUTTON);
        type(FacultyRegistrationPage.FIRST_NAME_TEXTBOX, "firstName");
        type(FacultyRegistrationPage.LAST_NAME_TEXTBOX, "lastName");
        type(FacultyRegistrationPage.EMAIL_TEXTBOX, "testemail511@fiu.edu");
        type(FacultyRegistrationPage.PASSWORD_TEXTBOX, "Password01!");
        type(FacultyRegistrationPage.CONFIRM_PASSWORD_TEXTBOX, "Password01!");
        select(FacultyRegistrationPage.USER_TYPE_SELECT, FacultyRegistrationPage.USER_TYPE_SELECT_SECOND_OPTION);
        select(FacultyRegistrationPage.RANK_SELECT, FacultyRegistrationPage.RANK_SELECT_SECOND_OPTION);
        type(FacultyRegistrationPage.PID_TEXTBOX, "5555555");
        select(FacultyRegistrationPage.GENDER_SELECT, FacultyRegistrationPage.GENDER_SELECT_THIRD_OPTION);
        select(FacultyRegistrationPage.COLLEGE_SELECT, FacultyRegistrationPage.COLLEGE_SELECT_SECOND_OPTION);
        select(FacultyRegistrationPage.DEPARTMENT_SELECT, FacultyRegistrationPage.DEPARTMENT_SELECT_SECOND_OPTION);
        click(FacultyRegistrationPage.SUBMIT_BUTTON);
        click(Dialog.CONFIRM_BUTTON);
        waitForElementGone(Dialog.CONFIRM_BUTTON);
    }
}
