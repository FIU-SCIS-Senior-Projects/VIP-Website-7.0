package edu.fiu.vip_web.vip_r5_stories.tests.Card1211;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.AdminPanelPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.HomePage;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/27/17.
 */
public class Card1211Step extends SeleniumTestStep {

    public Card1211Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        click(HomePage.ADMIN_PANEL_BUTTON);
        waitForElement(AdminPanelPage.DOWNLOAD_EXCEL_BUTTON);
        int users = countUsers();
        Assert.assertTrue(users > 1);
        type(AdminPanelPage.EMAIL_FILTER_TEXTBOX, getTestData().getStudentUsername());
        Assert.assertTrue(countUsers() == 1);
    }

    private int countUsers() {
        int i = 0;
        By firstName = null;
        do {
            firstName = By.xpath(String.format(AdminPanelPage.XPATH_FIRST_NAME_FIELD_FORMAT, ++i));
        } while(isElementPresent(firstName));
        return i - 1;
    }
}
