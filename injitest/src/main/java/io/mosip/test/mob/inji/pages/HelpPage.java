package io.mosip.test.mob.inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class HelpPage extends BasePage {

    @AndroidFindBy(accessibility = "helpScreen")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeStaticText[`label == \"Help\"`]")
    private WebElement helpText;

    @AndroidFindBy(xpath = "//*[@resource-id=\"iconIcon\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`label == \"\uE5CD\"`][2]")
    private WebElement crossIcon;

    public HelpPage(AppiumDriver driver) {
        super(driver);
    }

    public boolean isHelpPageLoaded() {
        return this.isElementDisplayed(helpText, "Help page");
    }

    public void exitHelpPage() {
        this.clickOnElement(crossIcon);
    }

}
