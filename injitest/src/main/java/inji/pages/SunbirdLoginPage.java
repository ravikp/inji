package inji.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;

public class SunbirdLoginPage extends BasePage {



    @AndroidFindBy(xpath = "//android.widget.EditText[@resource-id=\"_form_policyNumber\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeTextField[`name == \"Please fill in this field\"`][1]")
    private WebElement enterPolicyTextBox;

    @AndroidFindBy(xpath = "//android.widget.EditText[@resource-id=\"_form_fullName\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeTextField[`name == \"Please fill in this field\"`][2]")
    private WebElement enterFullnameTextBox;

    @AndroidFindBy(xpath = "//android.widget.Spinner[@resource-id=\"_form_dob\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeOther[`name == \"Please fill in this field\"`]")
    private WebElement enterDateOfBirthTextBox;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"android:id/button1\"]")
    @iOSXCUITFindBy(accessibility = "Done")
    private WebElement clickOnSetButton;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='01 January 2024']")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`name == \"Monday, 1 January\"`]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther")
    private WebElement dateOfBirth;
    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"verify_form\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`name == \"Login\"`]")
    private WebElement loginButton;

    @AndroidFindBy(xpath = "//android.widget.ImageButton[@content-desc=\"Previous month\"]")
    @iOSXCUITFindBy(accessibility = "Previous Month")
    private WebElement previousMonth;

    @AndroidFindBy(accessibility = "activated")
    @iOSXCUITFindBy(accessibility = "Activated")
    private WebElement activatedStatus;

    @AndroidFindBy(accessibility = "a square logo of a Sunbird")
    @iOSXCUITFindBy(accessibility = "a square logo of a Sunbird")
    private WebElement sunbirdLogo;

    @AndroidFindBy(accessibility = "NameValue")
    @iOSXCUITFindBy(accessibility = "NameValue")
    private WebElement fullName;

    @AndroidFindBy(accessibility = "Policy NameValue")
    @iOSXCUITFindBy(accessibility = "Policy NameValue")
    private WebElement policyName;

    @AndroidFindBy(accessibility = "ID TypeValue")
    @iOSXCUITFindBy(accessibility = "ID TypeValue")
    private WebElement idType;

    @iOSXCUITFindBy(accessibility = "Continue")
    private WebElement continueButton;

    @AndroidFindBy(accessibility = "valid")
    @iOSXCUITFindBy(accessibility = "valid")
    private WebElement status;

    @AndroidFindBy(accessibility = "Email IdValue")
    @iOSXCUITFindBy(accessibility = "Email IdValue")
    private WebElement emailIdValue;

    @AndroidFindBy(accessibility = "GenderValue")
    @iOSXCUITFindBy(accessibility = "GenderValue")
    private WebElement gender;

    @AndroidFindBy(accessibility = "Date of BirthValue")
    @iOSXCUITFindBy(accessibility = "Date of BirthValue")
    private WebElement dateofBirthValue;

    @AndroidFindBy(accessibility = "Phone NumberValue")
    @iOSXCUITFindBy(accessibility = "Phone NumberValue")
    private WebElement phoneNumber;

    @AndroidFindBy(accessibility = "Policy NumberValue")
    @iOSXCUITFindBy(accessibility = "Policy NumberValue")
    private WebElement policyNumber;

    @AndroidFindBy(accessibility = "ExpiryValue")
    @iOSXCUITFindBy(accessibility = "ExpiryValue")
    private WebElement expiryValue;

    @AndroidFindBy(accessibility = "profileAuthenticated")
    @iOSXCUITFindBy(accessibility = "profileAuthenticated")
    private WebElement activeStatus;

    @AndroidFindBy(accessibility = "qrCodeHeader")
    @iOSXCUITFindBy(accessibility = "qrCodeHeader")
    private WebElement qrCodeHeader;

    public SunbirdLoginPage(AppiumDriver driver) {
        super(driver);
    }
    BasePage basePage = new BasePage(driver);



    public void enterPolicyNumberTextBox(String PolicyNo) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        sendKeysToTextBox(enterPolicyTextBox, PolicyNo);
    }

    public void enterFullNameTextBox(String fullname) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        sendKeysToTextBox(enterFullnameTextBox, fullname);
    }

    public void enterDateOfBirthTextBox() {
        clickOnElement(enterDateOfBirthTextBox);
        int MAX_ATTEMPTS = 12;
        if (!isElementDisplayed(dateOfBirth, 5)) {
            for (int i = 0; i < MAX_ATTEMPTS; i++) {
                try {
                    clickOnElement(previousMonth);
                    if(isElementDisplayed(dateOfBirth,3)) {
                        break;
                    }
                } catch (TimeoutException e) {
                } catch (NoSuchElementException e) {
                    break;
                }
            }
        }

        if (isElementDisplayed(dateOfBirth)) {
            clickOnElement(dateOfBirth);
            clickOnElement(clickOnSetButton);
        }
    }
    public void clickOnloginButton() {
        clickOnElement(loginButton);
    }

    public boolean isSunbirdCardIsActive() {
        basePage.retrieToGetElement(activatedStatus);
        return this.isElementDisplayed(activatedStatus);
    }

    public boolean isSunbirdCardLogoIsDisplayed() {
        basePage.retrieToGetElement(sunbirdLogo);
        return this.isElementDisplayed(sunbirdLogo);
    }
    public String getFullNameForSunbirdCard() {
        basePage.retrieToGetElement(fullName);
        return this.getTextFromLocator(fullName);
    }
    public String getPolicyNameForSunbirdCard() {
        basePage.retrieToGetElement(policyName);
        return this.getTextFromLocator(policyName);
    }

    public String getPolicyNumberForSunbirdCard() {
        basePage.retrieToGetElement(policyNumber);
        return this.getTextFromLocator(policyNumber);
    }

    public String getPhoneNumberForSunbirdCard() {
        basePage.retrieToGetElement(phoneNumber);
        return this.getTextFromLocator(phoneNumber);
    }

    public String getDateofBirthValueForSunbirdCard() {
        basePage.retrieToGetElement(dateofBirthValue);
        return this.getTextFromLocator(dateofBirthValue);
    }

    public String getGenderValueForSunbirdCard() {
        basePage.retrieToGetElement(gender);
        return this.getTextFromLocator(gender);
    }

    public String getEmailIdValueForSunbirdCard() {
        basePage.retrieToGetElement(emailIdValue);
        return this.getTextFromLocator(emailIdValue);
    }

    public String getStatusValueForSunbirdCard() {
        basePage.retrieToGetElement(status);
        return this.getTextFromLocator(status);
    }

    public String getIdTypeValueForSunbirdCard() {
        basePage.retrieToGetElement(idType);
        return this.getTextFromLocator(idType);
    }

    public void clickOnContinueButtonInSigninPopupIos(){
        clickOnElement(continueButton);
    }

    public void openDetailedSunbirdVcView() {
        basePage.retrieToGetElement(fullName);
        clickOnElement(fullName);
    }
}
