package edu.fiu.vip_web.vip_r5_stories.tests.Card1210;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.util.Calendar;
import java.util.GregorianCalendar;

/**
 * Created by josep on 5/27/17.
 */
public class Card1210Step extends SeleniumTestStep {

    public Card1210Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        Calendar date = GregorianCalendar.getInstance();
        File users = new File(
                String.format("%s/%d-%d-%d_Report.xlsx", getTestData().getDownloadFolder(),
                        date.get(Calendar.MONTH) + 1,
                        date.get(Calendar.DAY_OF_MONTH),
                        date.get(Calendar.YEAR)));
        users.delete();
    }
}
