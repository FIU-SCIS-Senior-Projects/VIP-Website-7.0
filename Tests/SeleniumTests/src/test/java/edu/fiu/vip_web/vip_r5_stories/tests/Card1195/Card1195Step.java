
// #####################################################################
// #1195 Add a search Box in VIP projects page
//
// Description:
// As a user I would like to have a Search box which would let me search for
// the projects easily.
//
// Acceptance Criteria:
// When any word is entered the respective project should be displayed.
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1195;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProjectsPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.TopMenu;
import java.util.List;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**
 *
 * @author Dafna
 */

public class Card1195Step extends SeleniumTestStep {

    private final String searchString; 
     public Card1195Step(WebDriver driver, String str) {
        super(driver);
        searchString = str; 
    }

    @Override
    public void execute() throws Exception {
        
        waitForElement(TopMenu.PROJECTS);
        click(TopMenu.PROJECTS); 
        
        type(ProjectsPage.SEARCH_BOX, searchString);
        Thread.sleep(1000);
        List<WebElement> projects = getMultipleElements(ProjectsPage.PROJECT_CONTAINERS, 1);
      
        for (WebElement prBox : projects)
        {
            if (!prBox.getText().toUpperCase().contains(searchString.toUpperCase()))
            {
                Assert.fail("One or more projects does not match the search term \'" + searchString + "\'.\n" + prBox.getText());
                break;
            }
        }
        
      
    }
    
}
