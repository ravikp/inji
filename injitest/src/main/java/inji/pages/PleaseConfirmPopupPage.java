package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class PleaseConfirmPopupPage extends BasePage {
    @AndroidFindBy(accessibility = "yesConfirm")
    @iOSXCUITFindBy(accessibility = "yesConfirm")
    private WebElement yesButton;
    
    @AndroidFindBy(accessibility = "no")
    @iOSXCUITFindBy(accessibility = "no")
    private WebElement noButton;

    public PleaseConfirmPopupPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isPleaseConfirmPopupPageLoaded() {
        return this.isElementDisplayed(yesButton, "Popup confirmation page");
    }

    public OtpVerificationPage clickOnConfirmButton() {
        clickOnElement(yesButton);
        return new OtpVerificationPage(driver);
    }
    
    public OtpVerificationPage clickOnNoButton() {
        clickOnElement(noButton);
        return new OtpVerificationPage(driver);
    }

}