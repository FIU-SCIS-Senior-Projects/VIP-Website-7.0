package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.AdminPanelPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.HomePage;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.util.Calendar;
import java.util.GregorianCalendar;

/**
 * Created by josep on 5/29/17.
 */
public class DownloadExcelUsersDataStep extends SeleniumTestStep {

    public DownloadExcelUsersDataStep(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        click(HomePage.ADMIN_PANEL_BUTTON);

        Calendar date = GregorianCalendar.getInstance();
        File users = new File(
                String.format("%s/%d-%d-%d_Report.xlsx", getTestData().getDownloadFolder(),
                        date.get(Calendar.MONTH) + 1,
                        date.get(Calendar.DAY_OF_MONTH),
                        date.get(Calendar.YEAR)));
        users.delete();
        click(AdminPanelPage.DOWNLOAD_EXCEL_BUTTON);
        Thread.sleep(2000);

        Assert.assertTrue(users.exists());
    }
}
