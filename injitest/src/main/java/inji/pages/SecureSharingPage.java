package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class SecureSharingPage extends BasePage {

    @AndroidFindBy(accessibility = "introTitle-two")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introTitle\"])[3]")
    private WebElement secureSharingText;

    @AndroidFindBy(accessibility = "introText-two")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeStaticText[@name=\"introText\"])[3]")
    private WebElement secureSharingDescription;

    @AndroidFindBy(accessibility = "next")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeOther[@name=\"Susunod\" or @name=\"next\" or @name=\"अगला\" or @name=\"ಮುಂದೆ\" or @name=\"அடுத்தது\"])[4]\n")
    private WebElement nextButton;

    public SecureSharingPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);

    public String  verifyLanguageforSecureSharingPageLoaded(){
        basePage.retrieToGetElement(secureSharingText);
        return getTextFromLocator(secureSharingText);

    }

    public String getSecureSharingDescription() {
        basePage.retrieToGetElement(secureSharingDescription);
        return this.getTextFromLocator(secureSharingDescription);
    }

    public void clickOnNextButton() {
        this.clickOnElement(nextButton);
        new AppUnlockMethodPage(driver);
    }
}
