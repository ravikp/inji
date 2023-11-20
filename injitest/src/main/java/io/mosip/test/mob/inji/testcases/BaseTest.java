package io.mosip.test.mob.inji.testcases;


import io.appium.java_client.AppiumDriver;
import io.mosip.test.mob.inji.api.MockSMTPListener;
import io.mosip.test.mob.inji.constants.Target;
import io.mosip.test.mob.inji.driver.DriverManager;
import io.mosip.test.mob.inji.exceptions.PlatformNotSupportException;
import io.mosip.test.mob.inji.utils.TestDataReader;

import org.testng.annotations.*;


import java.net.MalformedURLException;

public class BaseTest {
	public static String NewOtp=GetOtp();
    protected AppiumDriver driver;
    Target target = null;

    @BeforeSuite(alwaysRun = true)
    public void beforeSuite() {
        DriverManager.startAppiumServer();
    }

    @Parameters("platformName")
    @BeforeMethod(alwaysRun = true)
    public void setup(String platformName) {
        try {
            target = Target.valueOf(platformName);
            this.driver = DriverManager.getDriver(target);
        } catch (MalformedURLException | PlatformNotSupportException | InterruptedException e) {
            throw new RuntimeException(e);
        }
        //ScreenRecording.startScreenRecording(driver);
    }

    @AfterMethod(alwaysRun = true)
    public void teardown() {
        //ScreenRecording.stopScreenRecording(driver);
        driver.quit();
    }

    @AfterSuite(alwaysRun = true)
    public void afterSuite() {
        DriverManager.stopAppiumServer();
    }
    
    public static String GetOtp() {
  	  String otp="";
  	  String externalemail = TestDataReader.readData("externalemail");
  	  otp = MockSMTPListener.getOtp(externalemail);
  	  System.out.println(otp);
  	  return otp;
    }

}
