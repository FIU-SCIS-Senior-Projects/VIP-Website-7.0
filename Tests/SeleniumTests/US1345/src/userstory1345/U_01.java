package userstory1345;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class U_01 {
	WebDriver driver;
	
	// Test Data
	String addCourseSubject = "TST";
	String addCourseNumber = "1234";
	String addCourseSection = "U01";
	String addCourseID = "10101";
	String addCourseTitle = "Selenium Test Course";
	String addCourseSemester = "Fall 2017";
	
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
		goToCoursesMaintenance(driver);
		
		// Select AddNewCourse Button
		waitForPageLoad(driver, driver.findElement(By.id("addNewCourseButton")));
		driver.findElement(By.id("addNewCourseButton")).click();
		
		// Add Course Information
		waitForPageLoad(driver, driver.findElement(By.id("CreateCourseButton")));
		
		driver.findElement(By.id("addNewCourseInputSubject")).sendKeys(addCourseSubject);
		driver.findElement(By.id("addNewCourseInputNumber")).sendKeys(addCourseNumber);
		driver.findElement(By.id("addNewCourseInputSection")).sendKeys(addCourseSection);
		driver.findElement(By.id("addNewCourseInputID")).sendKeys(addCourseID);
		driver.findElement(By.id("addNewCourseInputTitle")).sendKeys(addCourseTitle);
		
		Select dropdown = new Select(driver.findElement(By.id("addCourseTerm")));
		dropdown.selectByVisibleText(addCourseSemester);
		
		driver.findElement(By.id("CreateCourseButton")).click();
		
		// Confirm Add Course Success/Error
		waitForPageLoad(driver, driver.findElement(By.xpath("/html/body/div[3]/h2")));
		WebElement addCourseMessage = driver.findElement(By.xpath("/html/body/div[3]/h2"));
		
		assertEquals("Success", addCourseMessage.getText());
		
		waitForPageLoad(driver, driver.findElement(By.xpath("/html/body/div[3]/div[7]/div/button")));
		driver.findElement(By.xpath("/html/body/div[3]/div[7]/div/button")).click();
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
	
	public void goToCoursesMaintenance(WebDriver driver) throws Exception {
		waitForPageLoad(driver, driver.findElement(By.xpath("/html/body/div/div/div/nav/div/ul/li[5]/button")));
		driver.findElement(By.xpath("/html/body/div/div/div/nav/div/ul/li[5]/button")).click();
	}
	
	// Waits for a page to finish loading before continuing with the test
	public void waitForPageLoad(WebDriver driver, WebElement element) throws Exception {
		WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.elementToBeClickable(element));
        Thread.sleep(2000);
	}
}
