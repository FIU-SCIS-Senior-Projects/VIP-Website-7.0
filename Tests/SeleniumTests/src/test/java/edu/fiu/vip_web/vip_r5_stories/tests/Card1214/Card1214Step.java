package edu.fiu.vip_web.vip_r5_stories.tests.Card1214;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProjectDetailsPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProjectsPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.TopMenu;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;

/**
 * Created by josep on 5/27/17.
 */
public class Card1214Step extends SeleniumTestStep {

    public Card1214Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        click(TopMenu.PROJECTS);
        waitForElement(ProjectsPage.FIRST_PROJECT_LINK);
        String project = getDriver().findElement(ProjectsPage.FIRST_PROJECT_LINK).getText();
        click(ProjectsPage.FIRST_PROJECT_LINK);
        waitForElement(ProjectDetailsPage.PROJECT_NAME_HEADER);
        Assert.assertTrue(project.equals(
                getDriver().findElement(ProjectDetailsPage.PROJECT_NAME_HEADER).getText()
        ));
    }
}
