package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.HomePage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.LoginPage;
import org.openqa.selenium.*;

public class AdminLoginStep extends SeleniumTestStep {

    public AdminLoginStep(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        String loginUrl = getTestData().getBaseUrl() + "login";
        getDriver().navigate().to(loginUrl);
        waitForUrlToBe(loginUrl);

        type(LoginPage.EMAIL_TEXTBOX, getTestData().getAdminUsername());
        type(LoginPage.PASSWORD_TEXTBOX, getTestData().getAdminPassword());
        click(LoginPage.LOGIN_BUTTON);
        waitForElement(HomePage.LOGOFF_BUTTON);
    }
}
