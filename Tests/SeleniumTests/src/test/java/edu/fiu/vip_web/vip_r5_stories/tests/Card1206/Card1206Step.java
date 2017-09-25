package edu.fiu.vip_web.vip_r5_stories.tests.Card1206;

import edu.fiu.vip_web.vip_r5_stories.common.ExcelDocument;
import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.AdminPanelPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.HomePage;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.function.Function;

/**
 * Created by josep on 5/29/17.
 */
public class Card1206Step extends SeleniumTestStep {

    public Card1206Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        click(HomePage.ADMIN_PANEL_BUTTON);
        waitForElement(AdminPanelPage.DOWNLOAD_EXCEL_BUTTON);

        Assert.assertTrue(getDriver().findElement(AdminPanelPage.PROJECT_APPLICATION_DATE_LABEL)
                .getText().toLowerCase().contains("Proj App Date".toLowerCase()));
        Assert.assertTrue(getDriver().findElement(AdminPanelPage.USER_REGISTRATION_DATE_LABEL)
                .getText().toLowerCase().contains("User Reg Date".toLowerCase()));
        Assert.assertTrue(getDriver().findElement(AdminPanelPage.FIRST_LOGIN_DATE_LABEL)
                .getText().toLowerCase().contains("First Login Date".toLowerCase()));

        Function<WebElement, String> getValue = element -> element.getText();

        if (!checkDateFound(AdminPanelPage.XPATH_PROJECT_APPLICATION_DATE_FIELD_FORMAT, 1, getValue)) {
            Assert.fail("Project application date doesn't seem to be recorded/shown");
        }
        if (!checkDateFound(AdminPanelPage.XPATH_USER_REGISTRATION_DATE_FIELD_FORMAT, 1, getValue)) {
            Assert.fail("User registration date doesn't seem to be recorded/shown");
        }
        if (!checkDateFound(AdminPanelPage.XPATH_FIRST_LOGIN_DATE_FIELD_FORMAT, 1, getValue)) {
            Assert.fail("First login date doesn't seem to be recorded/shown");
        }

        verifyExcelFile();
    }

    private void verifyExcelFile() {
        File users = null;
        FileInputStream fis = null;
        try {
            Calendar date = GregorianCalendar.getInstance();
            users = new File(
                    String.format("%s/%d-%d-%d_Report.xlsx", getTestData().getDownloadFolder(),
                            date.get(Calendar.MONTH) + 1,
                            date.get(Calendar.DAY_OF_MONTH),
                            date.get(Calendar.YEAR)));
            fis = new FileInputStream(users);
            ExcelDocument doc = new ExcelDocument(fis);
            assertDatesPresent(doc);

        } catch (FileNotFoundException e) {
            Assert.fail("The excel report was not correctly downloaded.");
        } catch (IOException e) {
            Assert.fail("Failed to read the excel report file.");
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException e) { }
            }
            if (users != null) {
                users.delete();
            }
        }
    }

    private void assertDatesPresent(ExcelDocument doc) {
        int sheet = 0;
        List<String> headers = doc.getRow(sheet, 0);

        int project_application_index = 14;
        int registration_index = 15;
        int first_login_index = 16;

        Assert.assertTrue("appliedDate".toLowerCase().equals(headers.get(project_application_index).toLowerCase()));
        Assert.assertTrue("RegDate".toLowerCase().equals(headers.get(registration_index).toLowerCase()));
        Assert.assertTrue("firstlogin_date".equals(headers.get(first_login_index).toLowerCase()));

        boolean applicationDateFound = false;
        boolean registrationDateFound = false;
        boolean firstLoginDateFound = false;

        DateFormat formatter = new SimpleDateFormat(DATE_FORMAT);
        for (int i = 1; i < doc.getRowCount(sheet); i++) {//check if dates exist for at least one record each
            List<String> row = doc.getRow(sheet, i);

            try {
                if (row.size() >= project_application_index + 1) {
                    formatter.parse(row.get(project_application_index));
                    applicationDateFound = true;
                }
            } catch (ParseException e) { }
            try {
                if (row.size() >= registration_index + 1) {
                    formatter.parse(row.get(registration_index));
                    registrationDateFound = true;
                }
            } catch (ParseException e) { }
            try {
                if (row.size() >= first_login_index + 1) {
                    formatter.parse(row.get(first_login_index));
                    firstLoginDateFound = true;
                }
            } catch (ParseException e) { }
        }

        Assert.assertTrue("Application date does not show up in the excel file.", applicationDateFound);
        Assert.assertTrue("Registration date does not show up in the excel file.", registrationDateFound);
        Assert.assertTrue("First login date does not show up in the excel file.", firstLoginDateFound);
    }
}
