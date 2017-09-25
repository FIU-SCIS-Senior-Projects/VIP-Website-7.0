
package edu.fiu.vip_web.vip_r5_stories.common.step;

import edu.fiu.vip_web.vip_r5_stories.common.ui.HomePage;
import org.openqa.selenium.WebDriver;

/**
 *
 * @author Dafna
 */

public class ToAdminPanelStep  extends SeleniumTestStep{

    public ToAdminPanelStep(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        
        waitForElement(HomePage.ADMIN_PANEL_BUTTON); 
        click(HomePage.ADMIN_PANEL_BUTTON); 
        waitForUrlToBe(getTestData().getBaseUrl() + "adminpanel");
    }
    
    
}
