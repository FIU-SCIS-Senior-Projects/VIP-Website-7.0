package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.GoogleLogin;
import edu.fiu.vip_web.vip_r5_stories.common.ui.HomePage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.LoginPage;

import org.junit.Assert;
import org.openqa.selenium.*;

public class StudentLoginStep extends SeleniumTestStep {

    public StudentLoginStep(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        String loginUrl = getTestData().getBaseUrl() + "login";
        getDriver().navigate().to(loginUrl);
        waitForUrlToBe(loginUrl);

        waitForElement(LoginPage.GOOGLE_LOGIN_BUTTON);
        getDriver().findElement(LoginPage.GOOGLE_LOGIN_BUTTON).click();

        waitForElement(GoogleLogin.ID_USERNAME_TEXTBOX);
        waitForElement(GoogleLogin.USERNAME_NEXT_BUTTON);
        getDriver().findElement(GoogleLogin.ID_USERNAME_TEXTBOX).clear();
        getDriver().findElement(GoogleLogin.ID_USERNAME_TEXTBOX).sendKeys(getTestData().getStudentUsername());
        getDriver().findElement(GoogleLogin.USERNAME_NEXT_BUTTON).click();

        waitForElement(GoogleLogin.PASSWORD_TEXTBOX);
        waitForElement(GoogleLogin.ID_PASSWORD_NETX_BUTTON);

        getDriver().findElement(GoogleLogin.PASSWORD_TEXTBOX).clear();
        getDriver().findElement(GoogleLogin.PASSWORD_TEXTBOX).sendKeys(getTestData().getStudentPassword());
        getDriver().findElement(GoogleLogin.ID_PASSWORD_NETX_BUTTON).click();

        while (!getDriver().getCurrentUrl().startsWith(getTestData().getBaseUrl())) ;
        Assert.assertTrue(isElementPresent(HomePage.LOGOFF_BUTTON));
    }
}
