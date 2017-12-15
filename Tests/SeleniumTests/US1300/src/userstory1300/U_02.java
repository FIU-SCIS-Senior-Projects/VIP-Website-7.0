package userstory1300;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class U_02 {
	
	WebDriver driver;
	
	// Test Data
	String addUserFirstName = "testF";
	String addUserLastName = "testL";
	String addUserEmail = "test@testing.edu";
	String addUserPassword = "pass";
	
	@Before
	public void setUp() throws Exception {
		// Instantiate a ChromeDriver class
		String exePath = "C:\\Users\\Yizue\\Desktop\\Workspace\\chromedriver_win32\\chromedriver.exe";
		System.setProperty("webdriver.chrome.driver", exePath);
		driver = new ChromeDriver();
		
		driver.get("http://localhost:3000");
		
		// Login as Admin & goto AdminPanel
		loginAsAdmin(driver);
		goToAdminPanel(driver);
	}
	
	@Test
	public void test() throws Exception {
		goToUserMaintenance(driver);
		
		// Select AddNewUser Button
		waitForPageLoad(driver, driver.findElement(By.id("addNewUserStart")));
		driver.findElement(By.id("addNewUserStart")).click();
		
		// Enter NewUser Information
		waitForPageLoad(driver, driver.findElement(By.id("addNewUser")));
		
		driver.findElement(By.id("addUserFirstName")).sendKeys(addUserFirstName);
		driver.findElement(By.id("addUserLastName")).sendKeys(addUserLastName);
		driver.findElement(By.id("addUserEmail")).sendKeys(addUserEmail);
		driver.findElement(By.id("addUserPassword")).sendKeys(addUserPassword);
		driver.findElement(By.id("addUserPasswordConf")).sendKeys(addUserPassword);
		
		driver.findElement(By.id("addNewUser")).click();
		
		// Confirm Add User Success/Error
		waitForPageLoad(driver, driver.findElement(By.id("addUserMessage")));
		WebElement addUserMessage = driver.findElement(By.id("addUserMessage"));
		
		assertEquals("Error: Invalid Password", addUserMessage.getText().substring(0, 23));
		
		waitForPageLoad(driver, driver.findElement(By.id("addUserConfirm")));
		driver.findElement(By.id("addUserConfirm")).click();
	}

	@After
	public void tearDown() throws Exception {
		waitForPageLoad(driver, driver.findElement(By.xpath("/html/body/div/vip-header/div[1]/a[5]/button")));     
		driver.findElement(By.xpath("/html/body/div/vip-header/div[1]/a[5]/button")).click();
	 	
		driver.quit();
	}
	
	public void loginAsAdmin(WebDriver driver) throws Exception {
		waitForPageLoad(driver, driver.findElement(By.xpath("/html/body/div/vip-header/div[1]/a[3]/button")));
		WebElement loginButton = driver.findElement(By.xpath("/html/body/div/vip-header/div[1]/a[3]/button"));
		loginButton.click();
		
		waitForPageLoad(driver, driver.findElement(By.id("email")));
		WebElement adminEmail = driver.findElement(By.id("email"));
		adminEmail.clear();
		adminEmail.sendKeys("sadjadi@cs.fiu.edu");
		
		waitForPageLoad(driver, driver.findElement(By.id("password")));
		WebElement adminPass = driver.findElement(By.id("password"));
		adminPass.clear();
		adminPass.sendKeys(System.getenv("VIP_ADMIN_PASS"));
		
		waitForPageLoad(driver, driver.findElement(By.id("login")));
		driver.findElement(By.id("login")).click();
	}
	
	public void goToAdminPanel(WebDriver driver) throws Exception {
		waitForPageLoad(driver, driver.findElement(By.cssSelector("i.fa.fa-wrench")));
		driver.findElement(By.cssSelector("i.fa.fa-wrench")).click();
	}
	
	public void goToUserMaintenance(WebDriver driver) throws Exception {
		waitForPageLoad(driver, driver.findElement(By.xpath("/html/body/div/div/div/nav/div/ul/li[2]/button")));
		driver.findElement(By.xpath("/html/body/div/div/div/nav/div/ul/li[2]/button")).click();
	}
	
	// Waits for a page to finish loading before continuing with the test
	public void waitForPageLoad(WebDriver driver, WebElement element) throws Exception {
		WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.elementToBeClickable(element));
        Thread.sleep(2000);
	}
}
