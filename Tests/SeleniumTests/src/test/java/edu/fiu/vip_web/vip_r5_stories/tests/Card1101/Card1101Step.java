
// #####################################################################
// #1101 Add lock and unlock for projects in the teams page 
// 
//  Description:
//  As a PI of the website I would like to be able to:
//  - lock&unlock the project for now(so nobody can apply),
//  - Move the fall semester projects to the fall folder and 
//  - when new faculties apply for a project they can’t apply 
// for the fall any more and their new proposed projects goes to the spring 
// folder
// 
//  Acceptance Criteria:
//  Archives should be still available with a link or logo from new similar 
//  projects (PI add them manually like GitHub or Mingle link)
//  if it’s possible lock should be one for whole semester. and another way for
//  a specific project.
//  Pi must be enable to set and change
//  taking care of teams page application form
//  taking care of join buttons in the team page
// #####################################################################

package edu.fiu.vip_web.vip_r5_stories.tests.Card1101;

import edu.fiu.vip_web.vip_r5_stories.common.step.SeleniumTestStep;
import edu.fiu.vip_web.vip_r5_stories.common.step.ToSpecificProjectStep;
import edu.fiu.vip_web.vip_r5_stories.common.ui.AdminPanelPage;
import edu.fiu.vip_web.vip_r5_stories.common.ui.Dialog;
import edu.fiu.vip_web.vip_r5_stories.common.ui.ProjectDetailsPage;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.By;

/**
 *
 * @author Dafna
 */
public class Card1101Step extends SeleniumTestStep {
    
    private String status, project; 
    
     public Card1101Step(WebDriver driver, String prj, String stat) 
     {
        super(driver);
        status = stat; 
        project = prj; 
    }

    @Override
    public void execute() throws Exception {
      
        changeStatus(); 
        checkStatus(); 
        Thread.sleep(1000);
        
    }
    
    private void changeStatus() throws Exception
    {
        select(AdminPanelPage.LOCK_PROJ_PROJECT_COMBOBOX, project); 
        select(AdminPanelPage.LOCK_PROJ_STATUS_COMBOBOX, status); 
        click(AdminPanelPage.LOCK_PROJ_BUTTON); 
        
        waitForElement(Dialog.CONFIRM_BUTTON); 
        click(Dialog.CONFIRM_BUTTON); 
        
    }
    
    private void checkStatus() throws Exception
    {
        new ToSpecificProjectStep(getDriver()).execute(project);
        click(ProjectDetailsPage.JOIN_BUTTON);
        
        if ("Active".equals(status))
        {
            try {waitForElement(By.xpath("//div[@class='container']//h3[.=' Confirm Information ']"));}
            catch (InterruptedException e){Assert.fail("Project " + project + "was not activated.");}
        }
        if ("Disabled".equals(status))
        {
            try {waitForElement(Dialog.CONFIRM_BUTTON); click(Dialog.CONFIRM_BUTTON);}
            catch(InterruptedException e){Assert.fail("Project " + project + "was not disabled.");}
        }
    }
       
}
