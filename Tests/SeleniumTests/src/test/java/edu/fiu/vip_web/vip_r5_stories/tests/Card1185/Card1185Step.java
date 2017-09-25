// #####################################################################
// #1185 Add guideline videos to "Login page"
// 
// Descroption: None
// Acceptance Criteria: None 
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1185;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.HomePage;
import java.util.List;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**
 *
 * @author Dafna
 */

public class Card1185Step extends SeleniumTestStep {

    private String videoName = "FIUSCIS SeniorProject"; 
     public Card1185Step(WebDriver driver) {
        super(driver);
    }

    @Override
    public void execute() throws Exception {
        String loginUrl = getTestData().getBaseUrl() + "login";
        getDriver().navigate().to(loginUrl);
        waitForUrlToBe(loginUrl);

        waitForElement(By.cssSelector("iframe"));
        List<WebElement> iFrames = super.getMultipleElements(By.cssSelector("iframe")); 
        
        int i = 1; 
        for (WebElement fr : iFrames)
        {
            //String videoURL = fr.getCssValue("src"); 
            Assert.assertTrue("Guideline video " + i + " not displayed." ,fr.isDisplayed()); 
            
            getDriver().switchTo().frame(fr);
            waitForElement(By.cssSelector("a.ytp-title-link"));
            String videoTitle = getDriver().findElement(By.cssSelector("a.ytp-title-link")).getText(); 
            
            Assert.assertTrue(videoTitle.contains(videoName));
            getDriver().switchTo().parentFrame();

            i++; 
        }
      
    }
    
}
