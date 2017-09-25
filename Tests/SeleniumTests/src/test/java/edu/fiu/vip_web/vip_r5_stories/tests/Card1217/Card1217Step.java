package edu.fiu.vip_web.vip_r5_stories.tests.Card1217;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.AdminPanelPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.HomePage;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/27/17.
 */
public class Card1217Step extends SeleniumTestStep {

    public Card1217Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        click(HomePage.ADMIN_PANEL_BUTTON);
        type(AdminPanelPage.EMAIL_FILTER_TEXTBOX, getTestData().getStudentUsername());
        waitForElementGone(By.xpath(String.format(AdminPanelPage.XPATH_FIRST_NAME_FIELD_FORMAT, 2)));//wait for all other users to be filtered out
        Assert.assertTrue(getDriver().findElement(AdminPanelPage.FIRST_LOGIN_DATE_LABEL).getText()
                .toLowerCase().contains("First Login Date".toLowerCase()));//check this is definitely the first login date column
        Assert.assertTrue("First login date doesn't seem to be populated. This feature may not be implemented.",
                !getDriver().findElement(AdminPanelPage.FIRST_LOGIN_DATE_FIELD_FIRST).getText().trim().equals(""));//check that it's not empty
    }
}
